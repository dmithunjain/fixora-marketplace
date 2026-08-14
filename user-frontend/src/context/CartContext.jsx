import { createContext,useContext,useState,useEffect } from "react";

const CartContext=createContext();

export const CartProvider=({children})=>{

const [cart,setCart]=useState(()=>{
  const saved = localStorage.getItem('fixoraCart');
  return saved ? JSON.parse(saved) : [];
});

useEffect(()=>{
  localStorage.setItem('fixoraCart',JSON.stringify(cart));
},[cart]);

const getItemId = (item) => item.cartId || item.id;

const addToCart=(service)=>{
const itemId = getItemId(service);
const existingItem = cart.find((item)=>getItemId(item) === itemId);

if(existingItem){
setCart(prev=>prev.map(item=>
  getItemId(item) === itemId
  ? {...item, qty:(item.qty || 1) + 1}
  : item
));
}else{
setCart(prev=>[...prev,{...service, qty:1}]);
}
};

const updateQty=(id,newQty)=>{
if(newQty<=0){
removeFromCart(id);
return;
}
setCart(prev=>prev.map(item=>
  getItemId(item) === id ? {...item, qty:newQty} : item
));
};

const increaseQty=(id)=>{
setCart(prev=>prev.map(item=>
  getItemId(item) === id ? {...item, qty:(item.qty || 1) + 1} : item
));
};

const decreaseQty=(id)=>{
setCart(prev=>{
  const item = prev.find(i=>getItemId(i) === id);
  if(item && (item.qty || 1) <= 1){
    return prev.filter(i=>getItemId(i) !== id);
  }
  return prev.map(i=>
    getItemId(i) === id ? {...i, qty:(i.qty || 1) - 1} : i
  );
});
};

const removeFromCart=(id)=>{
setCart(prev=>prev.filter(item=>getItemId(item) !== id));
};

const clearCart=()=>{
setCart([]);
};

const totalPrice=cart.reduce(
(sum,item)=>sum+(item.price * (item.qty || 1)),0
);

return(
<CartContext.Provider
value={{cart,addToCart,updateQty,increaseQty,decreaseQty,removeFromCart,clearCart,totalPrice}}
>
{children}
</CartContext.Provider>
);

};

export const useCart=()=>useContext(CartContext);