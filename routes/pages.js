const express = require('express')
const router = express.Router()
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aladdin'
});

router.get('', (req, res) => {
    res.render('Home')
})
router.get('/Home', (req, res) => {
    res.render('Home')
})
router.get('/orders',(req,res)=>{
    res.render('orders')
})
router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/signin', (req, res) => {
    res.render('signin')
})
router.get('/Fruits', (req, res) => {
    db.query("select p.*, i.* from product p, inventory i where p.pro_id=i.pro_id and i.pro_availability='Available ' and  pro_cat='Fruits'  " , (error, results)=>{
        res.render('Fruits', {vegData: results})
    })
})
router.get('/vegetables', (req, res) => {
    db.query("select p.*, i.* from product p, inventory i where p.pro_id=i.pro_id and i.pro_availability='Available ' and  pro_cat='Vegetables'  " , (error, results)=>{
        res.render('vegetables', {vegData: results})
    })

})
router.get('/Dairyproducts', (req, res) => {
    db.query("select p.*, i.* from product p, inventory i where p.pro_id=i.pro_id and i.pro_availability='Available ' and  pro_cat='Dairy produts'  " , (error, results)=>{
        res.render('Dairyproducts', {vegData: results})
    })

})
router.get('/Meats', (req, res) => {
    db.query("select p.*, i.* from product p, inventory i where p.pro_id=i.pro_id and i.pro_availability='Available ' and  pro_cat='Meats'  " , (error, results)=>{
        res.render('Meats', {vegData: results})
    })
})
router.get('/shopkeeper',(req,res) => {

  res.render('shopkeeper')
})
router.get('/Add2cart',(req,res)=>{
    res.render('Add2cart')
})
router.get('/orders',(req,res)=>{
    res.render('orders')
})

router.get('/inventory', (req, res) => {
    db.query('select i.inventory_id, p.pro_img, p.pro_name, i.quantity, i.pro_price, i.pro_availability, i.create_date from product p, inventory i where p.pro_id=i.pro_id', (error, data) => {
        res.render('inventory', { inventoryData: data })
    })
})

router.get('/addinventory', (req, res) => {
    db.query('select product.* from product where NOT EXISTS(select pro_id from inventory where inventory.pro_id=product.pro_id)', (error, data) => {
        res.render('addinventory', { productData: data })
    })
})

router.get('/addtoinventory/:pro_id', (req, res) => {
    var pro_id = req.params.pro_id;
    db.query('select * from product where pro_id = ?', [pro_id], (error, results) => {
        res.render('addtoinventory', { addtoinventoryData: results })
    })
})

router.get('/editinventory/:inventory_id', (req, res) => {
    var inventory_id = req.params.inventory_id;
    db.query('select p.*, i.* from product p, inventory i where inventory_id=? and p.pro_id=i.pro_id', [inventory_id], (error, data) => {
        if (error) {
            console.log(error);
        }
        res.render('editinventory', { editinventoryData: data })
    })
})

router.get('/deleteinventory/:inventory_id', (req, res) => {
    var inventory_id = req.params.inventory_id;
    db.query('delete from inventory where inventory_id = ?', [inventory_id], (error, results) => {
        if (error) {
            console.log(error);
        }
        console.log(results.affectedRows + " record(s) updated");
        res.redirect('/inventory')
    });
});



router.get('/AdminArea', (req, res) => {
    db.query('select * from register', (error, results) => {
        var reg = results.length;
        res.render('AdminArea', { register: reg })
    })
})
router.get('/user', (req, res) => {
    db.query('select * from register', (error, data) => {
        res.render('user', { userData: data })
    })
})

router.get('/deleteuser/:id', (req, res) => {
    var id = req.params.id;
    db.query('delete from register where id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        console.log(results.affectedRows + " record(s) updated");
        res.redirect('/user')
    });
});

router.get('/add', (req, res) => {
    res.render('add')
})

router.get('/viewproduct', (req, res) => {
    db.query('select * from product', (error, data) => {
        res.render('viewproduct', { productData: data })
    })
})

router.get('/editproduct/:pro_id', (req, res) => {
    var pro_id = req.params.pro_id;
    db.query('select * from product where pro_id = ?', [pro_id], (error, results) => {
        if (error) {
            console.log(error);
        }
        res.render('editproduct', { editproductData: results })
    })
})

router.get('/deleteproduct/:pro_id', (req, res) => {
    var pro_id = req.params.pro_id;
    db.query('delete from product where pro_id = ?', [pro_id], (error, results) => {
        if (error) {
            console.log(error);
        }
        console.log(results.affectedRows + " record(s) updated");
        res.redirect('/viewproduct')
    });
});

router.get('/report', (req, res) => {
    db.query('SELECT COUNT(*) FROM register;', (error, data) => {
        res.render('report', { reportData: data })
        console.log(data)
    })
    
})

router.get('/procustomerreg', (req, res) => {
    res.render('procustomerreg')
})

router.get('/pro_customer', (req, res) => {
    res.render('pro_customer')
})

module.exports = router;