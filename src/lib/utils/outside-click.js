/**
 * 
 * @param {DOMElement} node 
 * @param {Function} handler 
 * @returns 
 */
 export default function outsideClickAction(node, handler) {
  const handleCheck = (event) => {
    if (!node.contains(event.target))
      handler(event);
  };

  document.addEventListener('click', handleCheck);
  
  return {
    destroy() {
      document.removeEventListener('click', handleCheck, true);
    }
  } 
}