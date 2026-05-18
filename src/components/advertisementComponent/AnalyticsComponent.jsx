"use client";
import PieChartGraph from "@/components/charts/PieChart";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { getTokenFromCookie } from "../../utils/helper";
import GlobalLoader from "@/utils/GlobalLoader";
import Link from "next/link";

const AnalyticsComponent = ({ id }) => {
  const [token, setToken] = useState(null);
  const [advertisement, setAdvertisement] = useState({});
  const [ad, setAd] = useState({});
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [isAdvertisementLoaded, setIsAdvertisementLoaded] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [impressionsCountries, setImpressionCountries] = useState([]);
  const [impressionsStates, setImpressionStates] = useState([]);
  const [impressionsCities, setImpressionCities] = useState([]);
  const [impressionsGender, setImpressionGender] = useState([]);
  const [impressionsAge, setImpressionAge] = useState([]);
  const [impressionTime, setImpressionTime] = useState([]);
  const [clicksCountries, setClicksCountries] = useState([]);
  const [clicksStates, setClicksStates] = useState([]);
  const [clicksCities, setClicksCities] = useState([]);
  const [clicksGender, setClicksGender] = useState([]);
  const [clicksAge, setClicksAge] = useState([]);
  const [clicksTime, setClicksTime] = useState([]);

  // Initialize token only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = getTokenFromCookie();
      setToken(storedToken);
    }
  }, []);

  const handleGetAdvertisement = async (token) => {
    if (!token || !id) return;
    
    setIsAdvertisementLoaded(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/advertisement/getAdvertisementById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res && res.data) {
        const adData = res.data?.data;
        setAdvertisement(adData);

        adData.creatives &&
          adData.creatives.forEach((creative) => {
            if (creative.uuid === id) {
              setAd(creative);
            }
          });

        const totalImpressions =
          adData.creatives &&
          adData.creatives.reduce(
            (acc, creative) =>
              acc + (creative.impressions ? creative.impressions.length : 0),
            0
          );
        setTotalImpressions(totalImpressions);

        const totalClicks =
          adData.creatives &&
          adData.creatives.reduce(
            (acc, creative) =>
              acc + (creative.clicks ? creative.clicks.length : 0),
            0
          );
        setTotalClicks(totalClicks);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdvertisementLoaded(false);
    }
  };

  useEffect(() => {
    if (token && id) {
      handleGetAdvertisement(token);
    }
  }, [token, id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    const debounce = (fn, delay) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
      };
    };

    const debouncedResize = debounce(handleResize, 200);

    handleResize();
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  const getAgeRange = (age) => {
    if (age >= 18 && age <= 25) {
      return "18-25";
    } else if (age >= 26 && age <= 45) {
      return "26-45";
    } else if (age >= 46 && age <= 55) {
      return "46-55";
    } else if (age >= 56 && age <= 65) {
      return "56-65";
    } else if (age > 65) {
      return "65+";
    }
  };

  const handleFindSlot = (impression, slot) => {
    const slotTime = slot.split("–");
    if (impression.time >= slotTime[0] && impression.time < slotTime[1]) {
      return impression;
    }
  };

  const getSlots = (currentTimeString) => {
    // Note: 'slots' variable is undefined, you may need to define it
    const slots = [
      { value: "08:00-14:00" },
      { value: "14:00-20:00" },
      { value: "20:00-02:00" },
      { value: "02:00-08:00" }
    ];
    
    if (currentTimeString >= "02:00" && currentTimeString < "08:00") {
      return slots[3].value;
    } else if (currentTimeString >= "08:00" && currentTimeString < "14:00") {
      return slots[0].value;
    } else if (currentTimeString >= "14:00" && currentTimeString < "20:00") {
      return slots[1].value;
    } else if (currentTimeString >= "20:00" || currentTimeString < "02:00") {
      return slots[2].value;
    }
  };

  const [filters, setFilters] = useState({
    gender: "",
    age: "",
    date: "",
    slot: "",
  });

  useEffect(() => {
    if (ad && advertisement.impressions && advertisement.impressions.length !== 0) {
      setImpressionCountries([]);
      setImpressionStates([]);
      setImpressionCities([]);
      setImpressionGender([]);
      setImpressionAge([]);
      setImpressionTime([]);

      const filteredImpressions = advertisement.impressions.filter(
        (impression) => {
          const meetsGenderFilter =
            filters.gender === "" || impression.gender === filters.gender;
          const meetsAgeFilter =
            filters.age === "" || getAgeRange(impression.age) === filters.age;
          const meetsDateFilter =
            filters.date === "" ||
            new Date(impression.date).toDateString() ===
            new Date(filters.date).toDateString();
          const meetsSlotFilter =
            filters.slot === "" || handleFindSlot(impression, filters.slot);

          return (
            meetsGenderFilter &&
            meetsAgeFilter &&
            meetsDateFilter &&
            meetsSlotFilter
          );
        }
      );

      filteredImpressions.forEach((impression) => {
        if (impression.country) {
          setImpressionCountries((prevCountries) => [
            ...prevCountries,
            impression.country,
          ]);
        }
        if (impression.states) {
          setImpressionStates((prevStates) => [
            ...prevStates,
            impression.states,
          ]);
        }
        if (impression.cities) {
          setImpressionCities((prevCities) => [
            ...prevCities,
            impression.cities,
          ]);
        }
        if (impression.gender) {
          setImpressionGender((prevGender) => [
            ...prevGender,
            impression.gender,
          ]);
        }
        if (impression.age) {
          setImpressionAge((prevAge) => [
            ...prevAge,
            getAgeRange(impression.age),
          ]);
        }
        if (impression.time) {
          setImpressionTime((prevTime) => [
            ...prevTime,
            getSlots(impression.time),
          ]);
        }
      });
    }
  }, [ad, filters, advertisement.impressions]);

  useEffect(() => {
    if (ad && advertisement.clicks && advertisement.clicks.length !== 0) {
      setClicksCountries([]);
      setClicksStates([]);
      setClicksCities([]);
      setClicksGender([]);
      setClicksAge([]);
      setClicksTime([]);
      
      const filteredClicks = advertisement.clicks.filter((click) => {
        const meetsGenderFilter =
          filters.gender === "" || click.gender === filters.gender;
        const meetsAgeFilter =
          filters.age === "" || getAgeRange(click.age) === filters.age;
        const meetsDateFilter =
          filters.date === "" ||
          new Date(click.date).toDateString() ===
          new Date(filters.date).toDateString();
        const meetsSlotFilter =
          filters.slot === "" || handleFindSlot(click, filters.slot);

        return (
          meetsGenderFilter &&
          meetsAgeFilter &&
          meetsDateFilter &&
          meetsSlotFilter
        );
      });

      filteredClicks.forEach((click) => {
        if (click.country) {
          setClicksCountries((prevCountries) => [
            ...prevCountries,
            click.country,
          ]);
        }
        if (click.states) {
          setClicksStates((prevStates) => [...prevStates, click.states]);
        }
        if (click.cities) {
          setClicksCities((prevCities) => [...prevCities, click.cities]);
        }
        if (click.gender) {
          setClicksGender((prevGender) => [...prevGender, click.gender]);
        }
        if (click.age) {
          setClicksAge((prevAge) => [...prevAge, getAgeRange(click.age)]);
        }
        if (click.time) {
          setClicksTime((prevTime) => [...prevTime, getSlots(click.time)]);
        }
      });
    }
  }, [ad, filters, advertisement.clicks]);

  const getAvailableBalance = (budget, totalBudgetUsed) => {
    return budget - totalBudgetUsed;
  };

  const availableBalance = getAvailableBalance(
    parseFloat(advertisement.budget || 0),
    advertisement.totalBudgetUsed || 0
  ).toFixed(2);

  const renderAdComponents = () => {
    if (!advertisement.creatives || advertisement.creatives.length === 0) {
      return null;
    }

    const firstCreative = advertisement.creatives[0];

    return (
      <Suspense fallback={<div>Loading...</div>}>
        {firstCreative.format === "Side Banner" && (
          <div className="flex p-4 justify-around w-full h-auto lg:h-[26rem] items-start">
            {firstCreative?.img && (
              <Link href={firstCreative?.adLink || "#"} target="_blank">
                <img
                  src={firstCreative?.img}
                  alt="Ad Image"
                  className="mt-2 w-72 rounded-lg"
                />
              </Link>
            )}
          </div>
        )}
        {firstCreative.format === "Quarter-Page Banner" && (
          <div className="flex p-4 justify-around w-full h-auto lg:h-[26rem] items-start">
            {firstCreative.img && (
              <Link href={firstCreative?.adLink || "#"} target="_blank">
                <img
                  src={firstCreative?.img}
                  alt="Ad Image"
                  className="mt-2 w-72 rounded-lg"
                />
              </Link>
            )}
          </div>
        )}
        {firstCreative.format === "Footer Banner" && (
          <div className="flex p-4 justify-around w-full h-auto lg:h-60 items-start">
            {firstCreative.img && (
              <Link href={firstCreative?.adLink || "#"} target="_blank">
                <img
                  src={firstCreative?.img}
                  alt="Ad Image"
                  className="mt-2 w-72 rounded-lg"
                />
              </Link>
            )}
          </div>
        )}
      </Suspense>
    );
  };

  const getCityCountryData = (creatives) => {
    if (!creatives) return { cityData: [], countryData: [] };
    
    const cityCounts = {};
    const countryCounts = {};

    creatives.forEach((creative) => {
      if (!creative.impressions) return;
      
      creative.impressions.forEach((impression) => {
        const city = impression.cities || "Unknown City";
        const country = impression.country || "Unknown Country";

        cityCounts[city] = (cityCounts[city] || 0) + 1;
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });
    });

    const totalImpressions = Object.values(cityCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalImpressions === 0) return { cityData: [], countryData: [] };

    const cityData = Object.keys(cityCounts).map((city) => ({
      name: city,
      value: parseFloat(
        ((cityCounts[city] / totalImpressions) * 100).toFixed(2)
      ),
    }));

    const countryData = Object.keys(countryCounts).map((country) => ({
      name: country,
      value: parseFloat(
        ((countryCounts[country] / totalImpressions) * 100).toFixed(2)
      ),
    }));

    return { cityData, countryData };
  };

  const getClicksCityCountryData = (creatives) => {
    if (!creatives) return { cityClicksData: [], countryClicksData: [] };
    
    const cityCounts = {};
    const countryCounts = {};

    creatives.forEach((creative) => {
      if (!creative.clicks) return;
      
      creative.clicks.forEach((impression) => {
        const city = impression.cities || "Unknown City";
        const country = impression.country || "Unknown Country";

        cityCounts[city] = (cityCounts[city] || 0) + 1;
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });
    });

    const totalImpressions = Object.values(cityCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    if (totalImpressions === 0) return { cityClicksData: [], countryClicksData: [] };

    const cityClicksData = Object.keys(cityCounts).map((city) => ({
      name: city,
      value: parseFloat(((cityCounts[city] / totalImpressions) * 100).toFixed(2)),
    }));

    const countryClicksData = Object.keys(countryCounts).map((country) => ({
      name: country,
      value: parseFloat(((countryCounts[country] / totalImpressions) * 100).toFixed(2)),
    }));

    return { cityClicksData, countryClicksData };
  };

  const renderCustomizeAddressLabel = (data) => {
    return ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fill="#fff"
          style={{ fontSize: "12px", fontWeight: "bold" }}
        >
          {`${data[index].name} (${data[index].value}%)`}
        </text>
      );
    };
  };

  const { cityData, countryData } = getCityCountryData(
    advertisement?.creatives
  );

  const { cityClicksData, countryClicksData } = getClicksCityCountryData(
    advertisement?.creatives
  );

  const renderCustomizedCityLabel = renderCustomizeAddressLabel(cityData);
  const renderCustomizedCountryLabel = renderCustomizeAddressLabel(countryData);
  
  const generateRandomColors = (numColors) => {
    const colors = [];

    while (colors.length < numColors) {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;
      const rgb = parseInt(randomColor.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (brightness > 50) {
        colors.push(randomColor);
      }
    }

    return colors;
  };

  if (isAdvertisementLoaded) return <GlobalLoader />;

  return (
    <div className="px-6 sm:px-12 lg:px-32">
      <div className="main-div">
        <div className="overlay">
          <div className="flex justify-between w-full px-0 my-8">
            <div className="flex items-end gap-2">
              <p className="text-2xl font-semibold">AD Analytics</p>
              <p className="text-[#A2913E] font-semibold">
                ({advertisement?.Approval || "Pending"})
              </p>
            </div>
          </div>
          <div style={{ minHeight: "100vh", width: "100%" }}>
            <div className="analytics-container" id="survey-content">
              <div className="flex items-center justify-center bg-white">
                <div className="flex-col items-center justify-center ">
                  <div className="flex">
                    <div className="flex-col items-center justify-center ">
                      <div className="flex">{renderAdComponents()}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex flex-col max-w-7xl w-full md:w-[100%]">
                  <div className="flex flex-col lg:flex-row justify-center gap-4">
                    <div className="bg-white shadow-2xl rounded-xl flex items-start h-32 justify-center py-4 pl-4 mx-0 my-2 lg:w-[30%]">
                      <div className="flex items-center justify-start w-full">
                        <div className="flex-col w-[110px]">
                          <div className="text-sm font-medium text-prussianBlue my-2 !whitespace-nowrap">
                            Available Balance (AED)
                          </div>
                          <div className="class flex items-center">
                            <div className="text-3xl font-bold text-prussianBlue">
                              {availableBalance}
                            </div>
                            <div className="flex items-center justify-between mx-2 px-0.5 py-0.5 rounded-xl text-green-500 font-medium "></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" shadow-2xl rounded-xl flex items-start h-32 justify-center py-4 pl-4 mx-0 my-2 lg:w-[30%]">
                      <div className="flex items-center justify-start w-full">
                        <div className="flex-col w-[110px]">
                          <div className="text-sm font-medium text-prussianBlue my-2 !whitespace-nowrap">
                            Used Balance (AED)
                          </div>
                          <div className="class flex items-center">
                            <div className="text-3xl font-bold text-prussianBlue">
                              {advertisement.totalBudgetUsed ? advertisement.totalBudgetUsed.toFixed(2) : "0.00"}
                            </div>
                            <div className="flex items-center justify-between mx-2 px-0.5 py-0.5 rounded-xl text-green-500 font-medium "></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" shadow-2xl rounded-xl flex items-start h-32 justify-center py-4 pl-4 mx-0 my-2 lg:w-[30%]">
                      <div className="flex items-center justify-start w-full">
                        <div className="flex-col w-[110px]">
                          <div className="text-sm font-medium text-prussianBlue my-2 !whitespace-nowrap">
                            Total Impressions
                          </div>
                          <div className="class flex items-center">
                            <div className="text-3xl font-bold text-prussianBlue">
                              {totalImpressions}
                            </div>
                            <div className="flex items-center justify-between mx-2 px-0.5 py-0.5 rounded-xl text-green-500 font-medium "></div>
                          </div>
                          <div className="w-full h-1 rounded my-1">
                            <div className="w-[78%] h-1 rounded bg-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" shadow-2xl rounded-xl flex items-start h-32 justify-center py-4 pl-4 mx-0 my-2 lg:w-[30%]">
                      <div className="flex items-center justify-start w-full">
                        <div className="flex-col w-[110px]">
                          <div className="text-sm font-medium text-prussianBlue my-2 !whitespace-nowrap">
                            Total Clicks
                          </div>
                          <div className="class flex items-center">
                            <div className="text-3xl font-bold text-prussianBlue">
                              {totalClicks}
                            </div>
                            <div className="flex items-center justify-between mx-2 px-0.5 py-0.5 rounded-xl text-red-500 font-medium "></div>
                          </div>
                          <div className="w-full h-1 rounded my-1">
                            <div className="w-[33%] h-1 rounded bg-red-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-8 bg-[#002d4f] shadow-2xl !text-white p-8 rounded-[24px]">
                <div className="flex items-start flex-col gap-3 mb-20">
                  <h2 className="text-start text-2xl font-semibold ">
                    Impressions
                  </h2>
                  <div className="w-full flex items-center justify-between ma-w-[80%]">
                    <p className="m-0 p-0">{totalImpressions}</p>
                  </div>
                </div>
                {isSmallScreen ? (
                  <></>
                ) : (
                  <div className="flex flex-wrap xl:flex-nowrap justify-center mt-5 mb-5 p-3 rounded-[12px]">
                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0 text-black">
                      <PieChartGraph
                        title="City"
                        data={cityData}
                        COLORS={generateRandomColors(cityData.length)}
                        renderCustomizedLabel={renderCustomizedCityLabel}
                      />
                    </div>
                    <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0 text-black">
                      <PieChartGraph
                        title="Country"
                        data={countryData}
                        COLORS={generateRandomColors(countryData.length)}
                        renderCustomizedLabel={renderCustomizedCountryLabel}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="my-8 bg-[#002d4f] !text-white p-8 rounded-[24px]">
                <div className="flex items-start flex-col gap-3 mb-20">
                  <h2 className="text-start text-2xl font-semibold ">Clicks</h2>
                  <div className="w-full flex items-center justify-between ma-w-[80%]">
                    <p className="m-0 p-0">{totalClicks}</p>
                  </div>
                </div>
                {isSmallScreen ? (
                  <></>
                ) : (
                  <div className="flex flex-wrap xl:flex-nowrap justify-center mt-5 mb-5 p-3 rounded-[12px]">
                    <div className="w-full flex text-start flex-col items-center md:w-1/3 px-2 mb-4 md:mb-0 text-black">
                      <div className="shrink-0 w-full">
                        <PieChartGraph
                          title="City"
                          data={cityClicksData}
                          COLORS={generateRandomColors(cityClicksData?.length)}
                          renderCustomizedLabel={renderCustomizedCityLabel}
                        />
                      </div>
                    </div>
                    <div className="w-full flex text-start flex-col items-center md:w-1/3 px-2 mb-4 md:mb-0 text-black">
                      <div className="shrink-0 w-full">
                        <PieChartGraph
                          title="Country"
                          data={countryClicksData}
                          COLORS={generateRandomColors(
                            countryClicksData.length
                          )}
                          renderCustomizedLabel={renderCustomizedCountryLabel}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;