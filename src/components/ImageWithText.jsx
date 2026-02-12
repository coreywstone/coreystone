import './ImageWithText.css'

function ImageWithText({ 
  imageSrc, 
  text, 
  width = '400px', 
  textPosition = 'top',
  alt = '',
  className = ''
}) {
  return (
    <div 
      className={`image-with-text ${textPosition === 'top' ? 'text-top' : 'text-bottom'} ${className}`}
      style={{ width }}
    >
      {textPosition === 'top' && (
        <div className="image-with-text-text">{text}</div>
      )}
      <div className="image-with-text-image-container">
        <img
          src={imageSrc}
          alt={alt}
          className="image-with-text-image"
          loading="lazy"
        />
      </div>
      {textPosition === 'bottom' && (
        <div className="image-with-text-text">{text}</div>
      )}
    </div>
  )
}

export default ImageWithText
