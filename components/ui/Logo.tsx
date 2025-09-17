import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex justify-center mt-5">
        <div className="relative w-60 h-60">
            <Image
             fill
             alt="Logotipo Fresh Coffee"
             src='/logo.svg'
            />

        </div>

    </div>
  )
}
