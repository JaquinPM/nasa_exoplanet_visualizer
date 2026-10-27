import "./CanvasContainer.css"
interface Props {
  children: React.ReactNode
}

/**
 * Main canvcas div container
 * @returns 
 */
export const CanvasContainer = ({ children }: Props) => {
  return <div className="canvas-container">
    {children}
  </div>
}
