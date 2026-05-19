import { redirect } from 'next/navigation'

export default async function page({ params }) {
  const { id } = await params
  redirect(`/jewelry/${id}`)
}
