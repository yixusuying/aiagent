export const validateButtonProps = (props) => {
  if (props.type && !['primary', 'default', 'dashed', 'text', 'link'].includes(props.type)) {
    console.warn(`Invalid button type: ${props.type}`)
  }
  
  if (props.size && !['large', 'middle', 'small'].includes(props.size)) {
    console.warn(`Invalid button size: ${props.size}`)
  }
}