import axios from 'axios'

import React, { useEffect, useState } from 'react'

const EditScreen = (props) => {

    const itemId = props.match.params.id
    const categoryName = props.location.search? props.location.search.split('=')[1]:null
    const [error, setError]=useState('')
    const [item, setItem]=useState({item_id : '', item_name: ''})

    const [message, setMessage]=useState('')

    const url = categoryName === 'home' ? '/api/items/' : '/api/categories/' + categoryName 

    useEffect(() => {
        

        axios.get(url)
            .then(response=>{
                const data = response.data
                if(data.categoryExist){
                    const foundItem = data.categoryExist.items.find(item=> item._id === itemId )
                    if(foundItem){
                       setItem({
                           ...foundItem
                       }) 
                    }
                }else{
                    const found = data.find(x=> x._id === itemId) 
                    if(found){
                        setItem({
                            ...found
                        })
                    }
                }

                
            }).catch(error=>{
                console.log(error.message)
                setError(error.message)
            })
        
    }, [itemId])


    const handleSubmit = (e)=>{
        e.preventDefault();
        if(item.item_name && categoryName ==='home'){
            axios.post('/api/item/update/',{
               item_id : itemId,
               item_name : item.item_name
            }).then(response=>{
                const data = response.data
                setMessage("data is updated successfully")
            }).catch(error=>{
                console.log(error.message)
            })
        }else if(item.item_name && categoryName){
            console.log("category")

            axios.post('/api/category/update/', {
                item_id : itemId,
                categoryName : categoryName,
                item_name : item.item_name
            }).then(response=>{
                const data = response.data
                alert('Data is updated successfully')
            }).catch(error=>{
                console.log(error.message)
                alert(error.message)
            })
        }
        
        else{
            console.log('field can not be empty....')
        }
    }


    return (
        <div className="container">
            { !error 
            ?   <> 
                <div className="title">
                    <h2>Category Name :{' '}{categoryName}</h2>
                </div>
                { 
                    message ? <div style={{textAlign:"center", color:"white"} } > <h3>{message}</h3> </div> : null

                }
                <div className="form" onSubmit={handleSubmit} >
                    <form>
                        <label>Item:</label>
                        <textarea rows={4} value = {item.item_name} name="item" onChange={(e)=>{setItem({item_name : e.target.value})}}/>
                        <button style={{ marginTop : "10px"}} type="submit">Update Item</button>
                    </form>
                </div>
                </>
            :
                <div>
                    {error}
                </div>
            }

        </div>
    )
}

export default EditScreen
