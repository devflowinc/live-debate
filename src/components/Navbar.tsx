import ConnectedIndicator from "./ConnectedIndicator"

const Navbar = () => {
  return (
    <div class="w-full bg-transparent border-b border-gray-800 flex justify-between items-center px-16 py-8">
      <div class="text-white text-2xl">Arguflow</div>
      <ConnectedIndicator />
    </div>
  )
}

export default Navbar