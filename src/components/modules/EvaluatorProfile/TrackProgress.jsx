'use client'

import React, { useEffect, useState } from "react";
import customAxios from "@/utils/apis/apis";
import { useProfile } from "../../../context/UserContext";
// import userProfile from "../../../context/UserContext"
function getStatusText(status) {
  if (status === 1 || status === '1') return 'Approved'
  if (status === 0 || status === '0') return 'Pending'
  if (status === 2 || status === '2') return 'In Progress'
  if (typeof status === 'string') return status
  return 'Pending'
}

const statusColors = {
  Pending: 'text-black font-medium',
  'In Progress': 'text-blue-500 font-medium',
  Approved: 'text-green-600 font-medium',
  Completed: 'text-green-600 font-medium',
}

export default function TrackProgress() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const {user}=useProfile()

  useEffect(() => {
    const fetchEvaluatorProgress = async () => {
      try {
        const parentIds = Array.from(
          new Set([user?._id, user?.uuid].filter(Boolean))
        )

        if (parentIds.length === 0) {
          console.error('No parent ID found.')
          return
        }

        const evaluatorResponses = await Promise.allSettled(
          parentIds.map((parentId) =>
            customAxios.get(`/evaluator/parent/${parentId}`)
          )
        );
        const evaluatorsMap = new Map()

        evaluatorResponses.forEach((result) => {
          if (result.status !== 'fulfilled' || result.value?.status !== 200) return
          const evaluators = Array.isArray(result.value?.data)
            ? result.value.data
            : []

          evaluators.forEach((evaluator) => {
            const key = evaluator?.uuid || evaluator?._id
            if (!key || evaluatorsMap.has(key)) return
            evaluatorsMap.set(key, evaluator)
          })
        })

        const evaluators = Array.from(evaluatorsMap.values())

        const allProgressData = []

        for (let evaluator of evaluators) {
          const assetsRes = await customAxios.get(
            `/evaluator/assigned/${evaluator._id}`
          );

          const assets = assetsRes.data?.payload || []

          for (let asset of assets) {
            allProgressData.push({
              subEvaluator: evaluator.name || 'Unnamed',
              asset: asset.title || asset.name || 'Unnamed Asset',
              assetType: asset.itemType || 'Unknown',
              status: asset.status || 'Pending',
            })
          }
        }

        setData(allProgressData)
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluatorProgress()
  }, [])

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
        Sub-Evaluator Progress
      </h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full border border-gray-200'>
          <thead>
            <tr className='primary-gradient text-white'>
              <th className='text-left py-3 px-4 font-medium'>
                Sub Evaluator Name
              </th>
              <th className='text-left py-3 px-4 font-medium'>
                Asset Assigned
              </th>
              <th className='text-left py-3 px-4 font-medium'>Asset Type</th>
              <th className='text-left py-3 px-4 font-medium'>Status</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {loading ? (
              <tr>
                <td colSpan='4' className='text-center py-4 text-gray-500'>
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan='4' className='text-center py-4 text-gray-500'>
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className='border-t border-gray-200 hover:bg-gray-50 transition duration-150'
                >
                  <td className='py-3 px-4'>{item.subEvaluator}</td>
                  <td className='py-3 px-4'>{item.asset}</td>
                  <td className='py-3 px-4 capitalize'>{item.assetType}</td>
                  <td
                    className={`py-3 px-4 ${
                      statusColors[getStatusText(item.status)] || ''
                    }`}
                  >
                    {getStatusText(item.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
