import customAxios from '@/utils/apis/apis'

export const isAssetAssignedToSubEvaluator = (asset) => {
  const assignee = asset?.evaluator || asset?.assignedTo || asset?.evaluatorUUID
  if (!assignee) return false
  if (typeof assignee === 'object') {
    return Boolean(assignee._id || assignee.uuid || assignee.name)
  }
  return String(assignee).trim().length > 0
}

export const assignAssetToSubEvaluator = async ({
  assetId,
  assetType,
  assigneeId,
}) => {
  const res = await customAxios.post('/assets/assign', {
    assetId,
    assetType,
    assigneeId,
  })
  return res.data
}

export const unassignAssetFromSubEvaluator = async ({ assetId, assetType }) => {
  const res = await customAxios.post('/assets/assign', {
    assetId,
    assetType,
    unassign: true,
  })
  return res.data
}
