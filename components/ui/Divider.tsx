type DividerProps = {
  orientation: 'h' | 'v'
}

export default function Divider({ orientation }: DividerProps) {
  if (orientation === 'v') {
    return <span className="inline-block h-full w-px bg-gray-200" />
  }
  return <div className="w-full h-px bg-gray-200" />
}

