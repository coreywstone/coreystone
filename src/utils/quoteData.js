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

