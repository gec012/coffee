"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function GoBackButton() {

    const router = useRouter()

  return (
    <button
    onClick={()=>router.back()}
    className="bg-teal-400 hover:bg-teal-800 w-full lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer rounded "
   >
   Volver
   </button>
  )
}
