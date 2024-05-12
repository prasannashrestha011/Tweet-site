import { RotatingLines } from "react-loader-spinner";

export default function PostLoader() {
  return (
    <RotatingLines
      strokeColor="black"
      strokeWidth="5"
      animationDuration="0.75"
      width="36"
      visible={true}
      style={{ position: 'absolute'}}
    />
  )
}