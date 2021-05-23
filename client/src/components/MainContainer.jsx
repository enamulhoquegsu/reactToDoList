import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {showDay} from '../date.js'





const MainContainer = ({props}) => {

    const [myresponse, setMyresponse]=useState("")
    const [deleteResponse, setDeleteResponse]=useState('')
    const [ deleteCategoryResponse, setDeleteCategoryResponse]=useState('')
    const [createCategoryResponse, setCreateCategoryResponse]=useState('')
    const [createCategory, setCreatedCategory]=useState('')
    const [categoryName, setCategoryName]=useState('')
    const [categoryList, setCategoryList]=useState([])
    const [item, setItem]=useState('')
    const [itemArray, setItemArray] = useState([])
    const [lists, setLists]=useState([])
    
   // only get list of categories name 
    useEffect(() => {
        axios.get('/api/categories/')
            .then(function (response) {
                // handle success
                console.log(response.data);
                setCategoryList(
                    [...response.data ]
                )
            })
            .catch(function (error) {
                console.log(error);
            })
    }, [createCategoryResponse]) // when ever a new category created, 
                                 //useEffect will run again
    
    useEffect(() => {
        if(categoryName){
            axios.get('/api/categories/' + categoryName )
            .then(function(response){
                const data = response.data
                //setCategoryName(data.categoryExist.category_name)
                setCategoryName(categoryName)
                setLists(data.categoryExist.items)
            }).catch(function(error){
                console.log(error)
                alert(error.message)
            })
        }
        
    
    }, [ categoryName,deleteCategoryResponse]) // when ever a item is deleted from category
                                

    useEffect(() => {
        axios.get('/api/items/')
            .then(function (response) {
                // handle success
                console.log(response.data);
                setItemArray(
                    [...response.data ]
                )
            })
            .catch(function (error) {
                console.log(error);
            })
    },  [myresponse, deleteResponse])

    const handleInput = (e)=>{
        const value = e.target.value
        setItem(value)

    }


    const handleCategoryChange = (e)=>{
        setCategoryName(e.target.value)
        // props.history.push('/category/'+ e.target.value )
        if(e.target.value){
            axios.get('/api/categories/' + e.target.value ).then(response=>{
                const data = response.data
                setCategoryName(data.categoryExist.category_name)
                setLists(data.categoryExist.items)
            
            }).catch(error=>{
                console.log(error.message)
            })
        }
    }


    // create a category if it does not exist. 
    const handleCreateCategorySubmit = ()=>{
          
        if(createCategory){
            axios.post('/api/createCategory/',{
                category : createCategory
            }).then(response=>{
                const data = response.data
                if(data.categoryExist){
                    alert("categrory " + data.categoryExist.category_name +" already exist")
                    setCategoryName(data.categoryExist.category_name)
                    setLists(data.categoryExist.items)
                } else if (data.saveList){
                    setCategoryName(data.saveList.category_name)
                    setLists(data.saveList.items)
                }
                setCreateCategoryResponse(new Date())
                setCreatedCategory('')
            }).catch(error=>{
                console.log(error.message)
            })

        }else{
            alert("Field is required")
        }
    }

    const deletButtonCLicked = (e,id)=>{
        
        if(lists && categoryName){
            axios.post('/api/item/delete/', {
                item_id : id ,
                categoryName : categoryName
             
            }).then(response=>{
                const data = response.data
                console.log(data)
                //setDeleteCategoyItemResponse(new Date())
                setCategoryName(data.category_name)
                setLists(data.items)
                
                setDeleteCategoryResponse(new Date())

            }).catch(error=>error.message)

        } else{
            axios.post('/api/item/delete/', {
            item_id : id 
            }).then(response=>{
                setDeleteResponse(new Date())
            }).catch(error=>error.message)
        }
    
    }

   
    // if url is root then only item created else a new category and also item created
    function handleSubmitItem(){
        if(item && categoryName){
            axios.post('/api/category/addItem/',{
                categoryName : categoryName,
                item : item
            }).then(response=>{
                const data = response.data
                setCategoryName(data.category_name)
                setLists(data.items)
                setMyresponse(new Date())
            }).catch(error=>{
                console.log(error.message)
            })
            setItem('')
        }

        else if(item){  
            axios.post('/api/items/', {
                item : item
            })
            .then(function (response) {
                console.log("i got response", response.data);
                setMyresponse(new Date())
               
            })
            .catch(function (error) {
                console.log(error);
            });    
            setItem('')
            
        } 
        else {
            console.log("field is empty")
        }


    }

    return (
        <div className="main-container">
            <div className="create-category">
                <div>
                    <input type="text" value= {createCategory} onChange={(e)=>{ setCreatedCategory(e.target.value) }} placeholder="create a category" required />
                    <button onClick={handleCreateCategorySubmit}>Enter</button>
                </div>
            </div>
            <div className="choose-category">
                <label>choose a category:{' '}</label>
                <select value={categoryName} onChange={handleCategoryChange}>
                    {categoryList.map((category, index)=>{return(
                        <option value={category} key={index}>{category}</option>
                    )})}
                    
                </select>
            </div>
            <div className="all-data">
                <div className="category">
                   { categoryName && lists ? categoryName : showDay() } 
                </div>

                { categoryName && lists 
                ?   <div className="delete-button">
                        { lists.map((x,ind)=>{return(
                            <div key={ind} className="info">
                                {x.item_name}
                                <div>
                                    <i 
                                        style={{marginRight:"10px"}}
                                        type="button" 
                                        name={x._id} 
                                        id={x._id}
                                        onClick={(e)=>{deletButtonCLicked(e, x._id)}} 
                                        className="fas fa-trash-alt" 

                                        // props.history.push(`/cart/${productId}?qty=${qty}`)
    
  

                                    />
                                    <i  
                                        style={{margin:"4px"}}
                                        name = {x._id}
                                        id = {x._id}
                                        onClick ={()=>
                                        { props.history.push("/item/edit/"+ x._id + '?categoryName='+ categoryName) }}
                                        className="fas fa-edit"
                                    />
                                </div>
                                
                            </div> 
                            
                            )})

                        }
                    </div>
          
                : 
                <div className="delete-button">
                    {itemArray.map((x,ind)=>{return(
                        <div key={ind} className="info">
                            {x.item_name}
                            <div>
                                <i 
                                    style={{marginRight:"10px"}}
                                    type="button" 
                                    name={x._id} 
                                    id={x._id}
                                    onClick={(e)=>{deletButtonCLicked(e, x._id)}} 
                                    className="fas fa-trash-alt" />
                                <i className="fas fa-edit" 
                                    style={{margin:"4px"}}
                                    name = {x._id}
                                    id = {x._id}
                                    onClick ={()=>
                                    { props.history.push("/item/edit/"+ x._id + "?categoryName=home") } }
                                />
                            </div>
                            
                        </div>   
                        )})

                    }
                       
                </div>
                }
                <div className="enter-item">
                    <input 
                        value={item}
                        type="text" 
                        name="item" 
                        placeholder="enter a item name"
                        onChange={ handleInput}/>
                    <button onClick={handleSubmitItem}>
                        <i className="fas fa-plus-circle" />
                    </button>
                </div>
            </div>
        </div>
    )
}



export default MainContainer
