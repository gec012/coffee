export function formatCurrency(amount:number){
    return new Intl.NumberFormat('es-AR',{
        style:'currency',
        currency: 'ARS'
    }).format(amount);

}