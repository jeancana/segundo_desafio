const fs = require('fs')

class ProductManager {
    
    #products

    constructor() {
        this.#products = []
        this.path = './productos.txt'
    }

    #generateId = () => (this.#products.length === 0) ? 1 : this.#products[this.#products.length - 1].id + 1

    #validateProduct = (title, description, price, thumbnail, code, stock) => {
      
        if (!title || !description || !price || !thumbnail || !code || !stock) {

            return `En el objeto ${title}: Faltan Campos por Cargar`
  
        } else {

            const found = this.#products.find(item => item.code === code)
            if (!found) return true
            return `En el objeto ${title}: codigo Duplicado`

        }


    }


    //  ******* Haciendo el C.R.U.D *******

    // <<<< CREATE  >>>> 
    addProduct = (title, description, price, thumbnail, code, stock) => {

        if (this.#validateProduct(title, description, price, thumbnail, code, stock) === true) {

            this.#products.push({ id: this.#generateId(), title, description, price, thumbnail, code, stock })
            fs.writeFileSync(this.path, JSON.stringify(this.#products, null, '\t'))

        } else {
            
            console.log(this.#validateProduct(title, description, price, thumbnail, code, stock))

        }

    }

    
    //<<< READ >>>> 

    // Creando el Metodo que lea lo contenido en el Archivo productos.txt
    // Lo Privatizamos el Metodo 
    #readProducts = () => {
        let contenido = fs.readFileSync(this.path, 'utf-8')
        return JSON.parse(contenido)
    }

    // READ NRO.1 
    getProducts = () => {
        let showProducts = this.#readProducts()
        return console.log(showProducts)
    }
    
    // READ NRO.2 
    getProductsById = (id) => {

        const product = this.#readProducts().find(item => item.id === id)
        
        if (!product) {
            return 'Id No encontrado'
        } else {
            return product
        }
        
    }

    // <<<< UPDATE >>>>

    updateProducts = ({ id, ...producto }) => {
        
        // Eliminamos(Pisamos) el Producto a Actualizar
        this.deleteProductsById(id)

        // Aca Guardamos el Array de Objetos restante
        let oldProducts = this.#readProducts()
        //console.log(oldProducts)

        // Agregamos el Objeto Actualizado al Array de Objetos y lo juntamos con el restos mediante el spread operator
        let updateProducts = [{ id, ...producto }, ...oldProducts]
        console.log(updateProducts)

        // Pisando el archivo TXT - con las actualizaciones
        fs.writeFileSync(this.path, JSON.stringify(updateProducts, null, '\t'))

    }   
    

    // <<<< DELETE >>>>

    deleteProductsById = (id) => {
        let showProducts = this.#readProducts()
        let filterProduct = showProducts.filter((producto) => producto.id != id)

        // Consologueando  viendo que elimino del Array el producto indicado con el ID
        console.log(filterProduct)
        console.log('Producto Eliminado')

        // Pisando el archivo TXT
        fs.writeFileSync(this.path, JSON.stringify(filterProduct, null, '\t'))
    }
      
 
}
 

// Instanciando un Objeto de la clase ProductManager
const productManager = new ProductManager()

// <<< Probando el CREATE >>>>
/* 
productManager.addProduct('Sandia','fruta', 100, 'URL - WEB', '104', 7000)
productManager.addProduct('Manzana', 'fruta', 200, 'URL - WEB', '105', 8000)
productManager.addProduct('Pera', 'fruta', 300, 'URL - WEB', '106', 9000)
*/

// <<< Probando el READ >>>>
// --- Metodo 1 Mostrando todo
//console.log(productManager.getProducts())

// --- Metodo 2 Mostrando 1 solo 
//console.log(productManager.getProductsById(2))

// <<< Probando el UPDATE >>>>

// Actualizando un Objeto del Array de Objetos
productManager.updateProducts(

    {
        "id": 3,
        "title": "Pera",
        "description": "fruta",
        "price": 50000,
        "thumbnail": "URL - WEB",
        "code": "106",
        "stock": 9000
    }
)

// <<< Probando el DELETE >>>>
//console.log(productManager.deleteProductsById(1))


