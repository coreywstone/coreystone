import './TextboxImagePair.css'

function TextboxImagePair({ 
  title, 
  text, 
  image, 
  imageAlt = '', 
  backgroundColor = null, 
  textColor = null 
}) {
  const textBoxStyle = {}
  if (backgroundColor) {
    textBoxStyle.backgroundColor = backgroundColor
  }
  if (textColor) {
    textBoxStyle.color = textColor
  }

  return (
    <div className="textbox-image-pair">
      <div 
        className="textbox-image-pair-textbox" 
        style={Object.keys(textBoxStyle).length > 0 ? textBoxStyle : undefined}
      >
        {title && (
          <h3 className="textbox-image-pair-title">{title}</h3>
        )}
        {text && (
          <p className="textbox-image-pair-text">{text}</p>
        )}
      </div>
      <div className="textbox-image-pair-image-container">
        <img 
          src={image} 
          alt={imageAlt || 'Project sketch'}
          className="textbox-image-pair-image"
        />
      </div>
    </div>
  )
}

export default TextboxImagePair
