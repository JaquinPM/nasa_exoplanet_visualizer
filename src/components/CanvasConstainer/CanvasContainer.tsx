import "./CanvasContainer.css"
interface Props {
  children: React.ReactNode
}
export const CanvasContainer = ({ children }: Props) => {
  return <div className="canvas-container">
    {children}
  </div>
}
