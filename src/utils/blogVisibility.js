export function isActiveBlog(blog) {
  const status = String(blog?.status ?? 'Active').trim().toLowerCase()
  return status !== 'inactive'
}

export function filterActiveBlogs(blogs) {
  return (blogs || []).filter(isActiveBlog)
}

export function getBlogFeaturedTimestamp(blog) {
  if (!isFeaturedBlog(blog)) return 0
  const value = blog?.featuredAt || blog?.updatedAt || blog?.createdAt
  return new Date(value || 0).getTime()
}

export function sortBlogsForDisplay(blogs) {
  return [...(blogs || [])].sort((a, b) => {
    const featuredDiff =
      Number(isFeaturedBlog(b)) - Number(isFeaturedBlog(a))
    if (featuredDiff !== 0) return featuredDiff
    const featuredTimeDiff =
      getBlogFeaturedTimestamp(b) - getBlogFeaturedTimestamp(a)
    if (featuredTimeDiff !== 0) return featuredTimeDiff
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  })
}

export function isFeaturedBlog(blog) {
  const value = blog?.isFeatured
  return value === true || value === 'true' || value === 1 || value === '1'
}

export function pickFeaturedBlog(blogs) {
  return (
    sortBlogsForDisplay(filterActiveBlogs(blogs)).find((blog) =>
      isFeaturedBlog(blog),
    ) || null
  )
}

export const PUBLIC_BLOG_FETCH_OPTIONS = {
  method: 'GET',
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
}
