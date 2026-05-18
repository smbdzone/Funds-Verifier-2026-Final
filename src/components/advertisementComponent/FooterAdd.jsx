"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useProfile } from "../../context/UserContext";
import { getFromLocalStorage, getTokenFromCookie, saveToLocalStorage } from "../../utils/helper";
import { GetUserIpAddress } from "@/utils/localization/GetUserLocalization";

function FooterAdd() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [footerAds, setFooterAds] = useState([]);
  const [largeQuarterAds, setLargeQuarterAds] = useState([]);
  const [currentCreativeIndex, setCurrentCreativeIndex] = useState(0);
  const [filterSidebarData, setFilterSidebarData] = useState([]);
  const [getImgData, setImgData] = useState(null);
  const [getAdLink, setAdLink] = useState(null);
  const [getObjId, setObjId] = useState(null);
  const [getAdvertiserId, setAdvertiserId] = useState(null);
  const [getClicks, setClicks] = useState(null);
  const [getImpressions, setImpressions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [getUserAdvertisement, setGetUserAdvertisement] = useState([]);
  const clicksLength = getClicks?.length ?? 0;
  const impressionsLength = getImpressions?.length ?? 0;
  const root = `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement`;

  const [ads, setAds] = useState([]);
  const [clickedAds, setClickedAds] = useState([]);
  const [watchedAds, setWatchedAds] = useState([]);
  const user = useProfile();
  const token = getTokenFromCookie();

  useEffect(() => {
    const handleGetClickedAds = async () => {
      const data = getFromLocalStorage("clickedAds") || [];
      setClickedAds(data);
    };
    handleGetClickedAds();
  }, [setClickedAds]);

  useEffect(() => {
    const handleGetWatchedAds = async () => {
      const data = getFromLocalStorage("watchedAds") || [];
      setWatchedAds(data);
    };
    handleGetWatchedAds();
  }, [setWatchedAds]);

  useEffect(() => {
    if (ads) {
      const formatAds = (format) =>
        ads
          .map((ad) => ({
            advertisementId: ad.uuid,
            creatives: ad.creatives.filter(
              (creative) => creative.format === format
            ),
          }))
          .filter((ad) => ad.creatives.length > 0);

      setLargeQuarterAds(formatAds("Quarter-Page Banner"));
      setFooterAds(formatAds("Footer Banner"));
    }
  }, [ads]);

  useEffect(() => {
    const handleGetAds = async () => {
      try {
        const res = await axios.get(`${root}/byDateAndTime`);
        setAds(res.data.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    handleGetAds();
  }, []);
  useEffect(() => {
    if (getUserAdvertisement && getUserAdvertisement.length > 0) {
      let objectIndex = 0;
      let creativeIndex = 0;

    
      creativeIndex =
        creativeIndex === getUserAdvertisement[objectIndex].creatives.length - 1
          ? 0
          : creativeIndex + 1;

      setImgData(
        getUserAdvertisement[objectIndex].creatives[creativeIndex]?.img?.url ||
        getUserAdvertisement[objectIndex].creatives[creativeIndex]?.img
      );
      setAdLink(
        getUserAdvertisement[objectIndex].creatives[creativeIndex]?.adLink
      );
      setObjId(getUserAdvertisement[objectIndex].creatives[creativeIndex]?.uuid);
      setAdvertiserId(getUserAdvertisement[objectIndex].uuid);
      setClicks(
        getUserAdvertisement[objectIndex].creatives[creativeIndex]?.clicks
      );
      setImpressions(
        getUserAdvertisement[objectIndex].creatives[creativeIndex]?.impressions
      );

      if (
        creativeIndex ===
        getUserAdvertisement[objectIndex].creatives.length - 1
      ) {
        objectIndex =
          objectIndex === getUserAdvertisement.length - 1 ? 0 : objectIndex + 1;
        creativeIndex = 0;
      }
      setLoading(false);
      
    }
  }, [getUserAdvertisement]);

  useEffect(() => {
    if (token) {
      const handleGetAdvertisementUser = async (token) => {
        try {
          const res = await axios.get(`${root}/getAllFooterBanners`, {
            headers: { Authorization: `Bearer ${token}`, },
          });
          if (res.data) {
            const combinedData = [
              ...res.data.data,
            ];
            setGetUserAdvertisement(combinedData);
          }
        } catch (error) {
          console.error("Error fetching advertisement data:", error);
        }
      };
      handleGetAdvertisementUser(token);
      const intervalId = setInterval(() => {
        handleGetAdvertisementUser(token);
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, [token]);

  const newArray = [
    ...(footerAds || []),
    {
      advertisementId: getAdvertiserId,
      creatives: [
        {
          img: getImgData,
          adLink: getAdLink,
          _id: getObjId,
        },
      ],
    },
  ];

  const canDoImpression = (watchedAdTime) => {
    const currentTimestamp = Date.now();
    const tomorrow2OClock = new Date(watchedAdTime);
    tomorrow2OClock.setDate(tomorrow2OClock.getDate() + 1);
    tomorrow2OClock.setHours(2, 0, 0, 0);
    return currentTimestamp >= tomorrow2OClock.getTime();
  };

  const handleImpressions = async (type, newArray, getObjId) => {
    const newData = [...watchedAds, { creativeId: getObjId, time: new Date() }];
    saveToLocalStorage("watchedAds", newData);
    setWatchedAds(newData);

    if (newArray[currentAdIndex].advertisementId !== getObjId) {
      const creativeId =
        newArray[currentAdIndex].creatives[currentCreativeIndex].uuid;

      const isAlreadyWatched = watchedAds.some((ad) => {
        return ad.creativeId === creativeId;
      });

      if (isAlreadyWatched) {
        const ip = await GetUserIpAddress();
        try {
          const response = await axios.put(`${root}/updatedImpressions`,
            {
              type: type,
              ip: ip,
              advertisementId: newArray[currentAdIndex]?.advertisementId,
              creativeId: getObjId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const newData = [
            ...watchedAds,
            { creativeId: getObjId, time: new Date() },
          ];

          saveToLocalStorage("watchedAds", newData);
          setWatchedAds(newData);
        } catch (error) {
          console.error("Error updating impressions:", error);
        }
      } else {
        const watchedAd = watchedAds.find((ad) => ad.creativeId === creativeId);
        if (canDoImpression(watchedAd)) {
          try {
            const ip = await GetUserIpAddress();
            await axios.put(
              `${root}/updatedImpressions`,
              {
                ip: ip,
                type: type,
                advertisementId: newArray[currentAdIndex].advertisementId,
                creativeId: getObjId,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const newData = watchedAds.filter((ad) => ad.creativeId !== creativeId);
            newData.push({ creativeId: getObjId, time: new Date() });

            saveToLocalStorage("watchedAds", newData);
            setWatchedAds(newData);
          } catch (error) {
            console.error("Error updating impressions:", error);
          }
        }
      }
    }
  };

  const handleClicks = async (
    advertisementId,
    creativeId,
    type,
    clickedAds,
    setClickedAds
  ) => {
    try {
      const ip = await GetUserIpAddress();
      await axios.put(
        `${root}/updatedClicks`,
        {
          ip: ip,
          type: type,
          advertisementId,
          creativeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const isAlreadyClicked = clickedAds.some(
        (ad) => ad.creativeId === creativeId
      );

      if (!isAlreadyClicked) {
        const newData = [...clickedAds, { creativeId, time: new Date() }];
        saveToLocalStorage("clickedAds", newData);
        setClickedAds(newData);
      } else {
        const clickedAd = clickedAds.find((ad) => ad.creativeId === creativeId);
        if (canDoImpression(clickedAd.time)) {
          const newDataClickedAds = clickedAds.filter(
            (ad) => ad.creativeId !== creativeId
          );
          newDataClickedAds.push({ creativeId, time: new Date() });
          saveToLocalStorage("clickedAds", newDataClickedAds);
          setClickedAds(newDataClickedAds);
        }
      }
    } catch (error) {
      console.error("Error handling clicks:", error);
    }
  };

  const filterDataByTargetAudience = (targetedAudienceCountry) => {
    return getUserAdvertisement.filter(
      (advertisement) =>
        advertisement.creatives.length > 0 &&
        advertisement.creatives[0]?.format === targetedAudienceCountry
    );
  };

  useEffect(() => {
    if (newArray.length > 0 && getObjId !== null && getObjId !== undefined) {
      handleImpressions("Footer Banner", newArray, getObjId);
    }
  }, [getUserAdvertisement]);

  useEffect(() => {
    if (getUserAdvertisement.length > 0) {
      const filteredData = filterDataByTargetAudience("Footer Banner");
      setFilterSidebarData(filteredData);
    }
  }, [getUserAdvertisement]);

  if (loading || !getImgData) return null;

  return (
    <>
      {newArray && newArray.length > 0 && (
        <div className="ads">
          <div className="img-div">
            <a
              href={getAdLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!getAdLink) {
                  e.preventDefault();
                } else {
                  handleClicks(
                    newArray[currentAdIndex].advertisementId,
                    newArray[currentAdIndex].creatives[currentCreativeIndex]
                      .uuid,
                    "Footer Banner",
                    clickedAds,
                    setClickedAds
                  );
                }
              }}
            >
              <img
                src={getImgData}
                alt="Footer Ad"
                style={{ marginBottom: "15px" }}
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
export default FooterAdd;
