import type { FC } from 'hono/jsx'

interface IconProps {
  size?: number
}

const UtensilsIcon: FC<IconProps> = ({ size = 24 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path fill-rule="evenodd" d="M15.75 1.5a.75.75 0 0 1 .75.75l-.004 1.5a3 3 0 0 1-1.5 2.599v14.901a.75.75 0 0 1-1.5 0V6.349a3 3 0 0 1-1.5-2.599L12 2.25a.75.75 0 0 1 .75-.75h3ZM7.599 5.82a3.375 3.375 0 0 1-.948 2.269 3.375 3.375 0 0 1-.837 13.161.75.75 0 0 1-1.128-.65V2.25a.75.75 0 0 1 1.5 0v1.69a1.875 1.875 0 0 0 1.287 1.78l.126.037v-.017Z" clip-rule="evenodd" />
    </svg>
  )
}

export default UtensilsIcon
