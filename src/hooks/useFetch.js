import { useCallback, useEffect, useState } from 'react'

export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps)

  const reload = useCallback(() => {
    let alive = true
    setLoading(true); setError('')
    run().then((d) => alive && setData(d))
         .catch((e) => alive && setError(e.message))
         .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [run])

  useEffect(() => reload(), [reload])
  return { data, loading, error, reload, setData }
}