const TMDB_KEY = import.meta.env.VITE_TMDB_KEY || 'd5a238ce9d1aacf575bb3142912d9638'
const BASE     = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p'

// Image size helpers
export const posterUrl   = (path, size = 'w500')    => path ? `${IMG_BASE}/${size}${path}` : null
export const backdropUrl = (path, size = 'w1280')   => path ? `${IMG_BASE}/${size}${path}` : null
export const thumbUrl    = (path, size = 'w185')    => path ? `${IMG_BASE}/${size}${path}` : null

// Placeholder when no poster
export const placeholderPoster = (title) =>
  `https://via.placeholder.com/500x750/16100a/d4a853?text=${encodeURIComponent(title)}`

async function tmdb(endpoint, params = {}) {
  const url = new URL(`${BASE}${endpoint}`)
  url.searchParams.set('api_key', TMDB_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${endpoint}`)
  return res.json()
}

// Search for a show/movie by name → returns first result
export async function searchTMDB(query, type = 'multi') {
  const data = await tmdb(`/search/${type}`, { query, include_adult: false })
  return data.results?.[0] || null
}

// Get details by TMDB id
export async function getTMDBDetails(id, type = 'tv') {
  return tmdb(`/${type}/${id}`)
}

// Batch: enrich an array of shows with TMDB poster paths
// shows = [{ show_name, tmdb_id, ... }, ...]
export async function enrichShowsWithPosters(shows) {
  const enriched = await Promise.all(
    shows.map(async (show) => {
      try {
        const type = show.tmdb_id < 10000 ? 'tv' : 'tv' // all are TV for now
        const detail = await getTMDBDetails(show.tmdb_id, 'tv')
        return {
          ...show,
          poster_path:   detail.poster_path   || null,
          backdrop_path: detail.backdrop_path || null,
          overview:      detail.overview      || '',
          genres:        detail.genres?.map(g => g.name) || [],
          networks:      detail.networks?.map(n => n.name) || [],
          status:        detail.status || '',
          vote_average:  detail.vote_average || 0,
          number_of_seasons: detail.number_of_seasons || null,
        }
      } catch {
        return { ...show, poster_path: null, backdrop_path: null }
      }
    })
  )
  return enriched
}

// Single show enrichment
export async function enrichShow(show) {
  try {
    const detail = await getTMDBDetails(show.tmdb_id, 'tv')
    return {
      ...show,
      poster_path:        detail.poster_path   || null,
      backdrop_path:      detail.backdrop_path || null,
      overview:           detail.overview      || '',
      genres:             detail.genres?.map(g => g.name) || [],
      networks:           detail.networks?.map(n => n.name) || [],
      status:             detail.status || '',
      vote_average:       detail.vote_average || 0,
      number_of_seasons:  detail.number_of_seasons || null,
      first_air_date:     detail.first_air_date || '',
      tagline:            detail.tagline || '',
    }
  } catch {
    return { ...show, poster_path: null, backdrop_path: null }
  }
}