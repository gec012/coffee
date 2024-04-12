



export default function ProductSearchForm() {
  return (
    <form className="flex items-center ">
        <input 
        type="text" 
        placeholder="Buscar Producto"
        className="p-2 placeholder-gray-400 w-full "
        name="search"
        />

        <input 
        type="submit"
        className="bg-sky-600 hover:bg-sky-800 p-2 uppercase text-white cursor-pointer"
        value={'Buscar'} 
        />
      
    </form>
    
  )
}
