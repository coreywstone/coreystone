// Map quote names to their asset paths
export const getQuoteAssets = (name) => {
  const basePath = `/img/quoters/${name}`
  
  const assets = {
    bgSrc: `${basePath}/${name}-bg.svg`,
    picSrc: `${basePath}/${name}-pic.svg`,
    titleSrc: `${basePath}/${name}-title.svg`,
    words1Src: null,
    words2Src: null,
    words3Src: null
  }
  
  // Try to detect which word files exist
  // For all quoters, try the standard pattern (words1, words2, words3)
  // QuotePanel will programmatically detect which ones actually exist
  assets.words1Src = `${basePath}/${name}-words1.svg`
  assets.words2Src = `${basePath}/${name}-words2.svg`
  assets.words3Src = `${basePath}/${name}-words3.svg`
  
  return assets
}

// Get alignment for a quote
export const getQuoteAlignment = (name, rowConfig) => {
  if (rowConfig.alignments && rowConfig.alignments[name]) {
    return rowConfig.alignments[name] // 'right' or 'left'
  }
  return 'left' // default
}

// Map quote names to LinkedIn URLs
export const getQuoteLinkedInUrl = (name) => {
  const linkedInUrls = {
    // Add LinkedIn URLs here as provided by user
    // Example: 'kaitlynn': 'https://www.linkedin.com/in/kaitlynn-griffith/',
    'anthony': 'https://www.linkedin.com/in/arezendes/',
    'jordan': 'https://www.linkedin.com/in/jordanzurowski',
    'ivy': 'https://www.linkedin.com/in/ivy-rueb',
    'elyse': 'https://www.linkedin.com/in/elyse-kolin',
    'paul': 'https://www.linkedin.com/in/paul-williams-77-design',
    'john': 'https://www.linkedin.com/in/john-s-norwood-pe-70119741/',
    'ben': 'https://www.linkedin.com/in/benmossman',
    'sri': 'https://www.linkedin.com/in/srirao18',
    'kaitlynn': 'https://www.linkedin.com/in/kaitlynn-griffith/',
    'andrea': 'https://www.linkedin.com/in/andrea-baker-aec/',
    'todd': 'https://www.linkedin.com/in/toddcohen1/',
    'derek': 'https://www.linkedin.com/in/derekdarby/',
    'rebekah': 'https://www.linkedin.com/in/rebekah-stevens-12259b6/'
  }
  
  return linkedInUrls[name] || null
}
