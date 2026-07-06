let sales =
    JSON.parse(
        localStorage.getItem(
            "pos_sales"
        )
    ) || [];

const salesContainer =
    document.getElementById(
        "salesContainer"
    );

function renderSales(
    data = sales
) {

    salesContainer.innerHTML = "";

    let revenue = 0;

    data.forEach(sale => {

        revenue += Number(sale.total || 0);

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "sale-card";

        let itemsHTML = "";

        sale.items.forEach(item => {

            itemsHTML += `

                <div class="sale-item">

                    <span>

                        ${item.name}
                        x${item.qty}

                    </span>

                    <span>

${formatCurrency(item.qty * item.price)}

                    </span>

                </div>

            `;

        });

        card.innerHTML = `

            <h3>

                ${sale.id}

            </h3>
<p>
    ${formatPrettyDate(sale)}
</p>
        <p class="hedaz">
        Date: ${formatDate(sale)}
        </p>
            <hr>
        <p class="hedaz">
        Items
        </p>
            <div class="sale-items">

                ${itemsHTML}

            </div>

            <hr>

            <h3>
         <p>

    Total:
    ${formatCurrency(sale.total)}

</p>

            </3>
            <br>

            <div id="batscont">
<button
    onclick="
        deleteSale(
            '${sale.id}'
        )
    ">

    Delete

</button>

</div>
            

        `;

        salesContainer.appendChild(
            card
        );

    });

    document.getElementById(
        "totalTransactions"
    ).textContent =
        data.length;

    document.getElementById(
        "totalRevenue"
    ).textContent =
        `K${revenue.toFixed(2)}`;

}

//==============================
// RENDER SALES TABLE
//==============================


function renderSalesTable(data = sales) {
if(!eligible){return(ineligible);}

    salesContainer.innerHTML = "";

    const table =
        document.createElement(
            "table"
        );

    table.className =
        "sales-table";

    let tableHTML = `

        <thead>

            <tr>

                <th>Receipt</th>

                <th>Date</th>

                <th>Item</th>

                <th>Qty</th>

                <th>Price</th>

                <th>Cost</th>

                <th>Total</th>

                <th>Profit</th>

            </tr>

        </thead>

        <tbody>

    `;

    data.forEach(sale => {

        sale.items.forEach(item => {

            const total =
                item.qty *
                item.price;

            const profit =
                (
                    item.price -
                    item.costPrice
                ) *
                item.qty;

            tableHTML += `

                <tr>

                    <td>
                        ${sale.id}
                    </td>

                    <td>
                        ${formatDate(sale)}
                    </td>

                    <td>
                        ${item.name}
                    </td>

                    <td>
                        ${item.qty}
                    </td>

                    <td>
                        ${formatCurrency(item.price)}
                    </td>

                    <td>
                        ${formatCurrency(item.costPrice)}
                    </td>

                    <td>
                        ${formatCurrency(total)}
                    </td>

                    <td>
                        ${formatCurrency(profit)}
                    </td>

                </tr>

            `;

        });

    });

    tableHTML += `

        </tbody>

    `;

    table.innerHTML =
        tableHTML;

    salesContainer.appendChild(
        table
    );

}


//TABLE RENDERING LISTNERS//

document
.getElementById(
    "tableViewLink"
)
.addEventListener(
    "click",
    () => {

        renderSalesAdminTable();

    }
);



// RENDER ADMIN SALES TABLE//

function renderSalesAdminTable(
    data = sales
){

    salesContainer.innerHTML = "";

    const wrapper =
    document.createElement(
        "div"
    );

    wrapper.className =
    "table-wrapper";

    const table =
    document.createElement(
        "table"
    );

    table.className =
    "sales-admin-table";

    let html = `

    <thead>

        <tr>

            <th>Receipt</th>
            <th>Date</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Cost</th>
            <th>Total</th>
            <th>Profit</th>
            <th>Item Actions</th>
            <th>Receipt</th>

        </tr>

    </thead>

    <tbody>

    `;

    data.forEach(sale=>{

        const items =
        Array.isArray(
            sale.items
        )
        ?
        sale.items
        :
        [];

        if(
            items.length===0
        ){

            html +=`

            <tr>

                <td>
                ${sale.id || "-"}
                </td>

                <td>
                ${formatDate(
                    sale
                )}
                </td>

                <td colspan="8">

                No Items Found

                </td>

            </tr>

            `;

            return;
        }

        items.forEach(

        (item,index)=>{

            const qty =
            Number(
                item.qty || 0
            );

            const price =
            Number(
                item.price || 0
            );

            const costPrice =
            Number(
                item.costPrice || 0
            );

            const total =
            qty * price;

            const profit =
            (
                price -
                costPrice
            )
            *
            qty;

            html +=`

            <tr>

            <td>

            ${sale.id || "-"}

            </td>

            <td>

            ${formatDate(
                sale
            )}

            </td>

            <td>

            ${item.name || "-"}

            </td>

            <td>

            ${qty}

            </td>

            <td>

            ${formatCurrency(
                price
            )}

            </td>

            <td>

            ${formatCurrency(
                costPrice
            )}

            </td>

            <td>

            ${formatCurrency(
                total
            )}

            </td>

            <td>

            ${formatCurrency(
                profit
            )}

            </td>

            <td>

            <div class="action-buttons">

            <button
            class="edit-btn"
            onclick="
            editSaleItem(
            '${sale.id}',
            ${index}
            )">

            <i class="fa-solid fa-pen"></i>

            </button>


            <button
            class="delete-btn"
            onclick="
            deleteSaleItem(
            '${sale.id}',
            ${index}
            )">

            <i class="fa-solid fa-trash"></i>

            </button>

            </div>

            </td>

            <td>

            <button
            class="receipt-delete"
            onclick="
            deleteSale(
            '${sale.id}'
            )">

            <i class="
            fa-solid
            fa-trash
            "></i>

            Delete Receipt

            </button>

            </td>

            </tr>

            `;

        });

    });

    html +=`

    </tbody>

    `;

    table.innerHTML =
    html;

    wrapper.appendChild(
        table
    );

    salesContainer.appendChild(
        wrapper
    );

}


document
.getElementById(
    "searchSale"
)
.addEventListener(
    "input",
    e => {

        const keyword =
            e.target.value
            .toLowerCase();

        const filtered =
            sales.filter(
                sale =>

                sale.id
                .toLowerCase()
                .includes(keyword)
            );

        renderSales(filtered);

    }
);

document
.getElementById(
    "searchSale"
)
.addEventListener(
    "input",
    e => {

        const keyword =
            e.target.value
            .toLowerCase();

        const filtered =
            sales.filter(
                items =>

                items.id
                .toLowerCase()
                .includes(keyword)
            );

        renderSales(filtered);

    }
);

function calculateTodaySales() {

    const now =
        new Date();

    const todayDay =
        now.getDate();

    const todayMonth =
        now.getMonth() + 1;

    const todayYear =
        now.getFullYear();

    let total = 0;

    sales.forEach(sale => {

        const date =
            getRecordDate(sale);

        if (

            date.day ===
            todayDay

            &&

            date.month ===
            todayMonth

            &&

            date.year ===
            todayYear

        ) {

            total +=
                Number(
                    sale.total || 0
                );

        }

    });

    document
    .getElementById(
        "todaySales"
    )
    .textContent =

        formatCurrency(total);

}


//**************************************** */
// MOMTHLY SALES
//*************************************** */
function calculateMonthlySales() {

    const now =
        new Date();

    const currentMonth =
        now.getMonth() + 1;

    const currentYear =
        now.getFullYear();

    let total = 0;

    sales.forEach(sale => {

        const date =
            getRecordDate(sale);

        if (

            date.month ===
            currentMonth

            &&

            date.year ===
            currentYear

        ) {

            total +=
                Number(
                    sale.total || 0
                );

        }

    });

    document
        .getElementById(
            "monthlySales"
        )
        .textContent =

        formatCurrency(total);

}

function calculateProfit() {

    let profit = 0;

    sales.forEach(sale => {

        sale.items.forEach(item => {

            profit +=

                (
                    item.price -
                    item.costPrice
                ) *

                item.qty;

        });

    });

    document
    .getElementById(
        "totalProfit"
    )
    .textContent =
        `K${profit.toFixed(2)}`;

}


function deleteSale(
    saleId
) {
    if(thisUser.access!=="Administrator"){
        return(showModal(`Sorry ${thisUser.firstName}`,'Something Went Wrong','nop' ));
    }
    showConfirm(

        "Delete Sale",

        "This action cannot be undone. Continue?",

        () => {

            sales =
                sales.filter(
                    sale =>
                        sale.id !==
                        saleId
                );

            localStorage.setItem(

                "pos_sales",

                JSON.stringify(
                    sales
                )

            );

            renderSales();

        }

    );

}


//************************************** */
//    DELETECONFIRMATION FUNCTION.
//************************************** */

let confirmCallback = null;

function showConfirm(

    title,

    message,

    callback

) {

    document
        .getElementById(
            "confirmTitle"
        )
        .textContent =
        title;

    document
        .getElementById(
            "confirmMessage"
        )
        .textContent =
        message;

    confirmCallback =
        callback;

    document
        .getElementById(
            "confirmModal"
        )
        .classList.add(
            "show"
        );

}

//************************************** */
//    DELETECONFIRMATION EVENTLISTENER
//************************************** */
document
.getElementById(
    "confirmCancel"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "confirmModal"
        )
        .classList.remove(
            "show"
        );

    }
);

document
.getElementById(
    "confirmOk"
)
.addEventListener(
    "click",
    () => {

        document
        .getElementById(
            "confirmModal"
        )
        .classList.remove(
            "show"
        );

        if (
            typeof confirmCallback
            === "function"
        ) {

            confirmCallback();

        }
        reload();
    }
);


// EDIT SALE ITEM FUNCTION//
function editSaleItem(
saleId,
itemIndex
){
    if(thisUser.access!=="Administrator"){
        return(showModal(`Sorry ${thisUser.firstName}`,'Something Went Wrong','nop' ));
    }
const sale=

sales.find(
x=>
x.id===saleId
);

if(
!sale
)return;

const item=

sale.items[
itemIndex
];

document
.getElementById(
"editSaleId"
)
.value=
saleId;

const container=

document
.getElementById(
"editItemsContainer"
);

container.innerHTML=`

<input
type="hidden"
id="editItemIndex"
value="${itemIndex}">

<p class="hedas">Name</p>
<div class="edit-item">

<input
value="${item.name}"
readonly>

<p class="hedas">Qty</p>
<input
id="editQty"
type="number"
value="${item.qty}">

<p class="hedas">Cost Price</p>
<input
id="editCost"
type="number"
value="${item.costPrice}">

<p class="hedas">Price</p>
<input
id="editPrice"
type="number"
value="${item.price}">

</div>



`;

document
.getElementById(
"editSaleModal"
)
.classList.add(
"show"
);

}

// SAVE EDIT FUNCTION//

document
.getElementById(
"saveEdit"
)
.addEventListener(

"click",

()=>{
    if(thisUser.access!=="Administrator"){
        return(showModal(`Sorry ${thisUser.firstName}`,'Something Went Wrong','nop' ));
    }
const saleId=

document
.getElementById(
"editSaleId"
)
.value;

const itemIndex=

Number(

document
.getElementById(
"editItemIndex"
)
.value

);

const sale=

sales.find(
x=>
x.id===saleId
);

if(
!sale
)return;

const item=

sale.items[
itemIndex
];

item.qty=

Number(
document
.getElementById(
"editQty"
)
.value
);

item.price=

Number(
document
.getElementById(
"editPrice"
)
.value
);

item.costPrice=

Number(
document
.getElementById(
"editCost"
)
.value
);

sale.total=

sale.items.reduce(

(sum,item)=>

sum+

(
item.qty*
item.price
),

0

);

localStorage.setItem(

"pos_sales",

JSON.stringify(
sales
)

);

document
.getElementById(
"editSaleModal"
)
.classList.remove(
"show"
);

reload();

renderSalesAdminTable();

});

// DELETE SALE ITMEM FUNCTION
function deleteSaleItem(
saleId,
itemIndex
){

    if(thisUser.access!=="Administrator"){
        return(showModal(`Sorry ${thisUser.firstName}`,'Something Went Wrong','nop' ));
    }

showConfirm(

"Delete Item",

"Remove this item from receipt?",

()=>{

const sale=

sales.find(
x=>
x.id===saleId
);

if(
!sale
)return;

sale.items.splice(
itemIndex,
1
);

if(

sale.items.length===0

){

sales=
sales.filter(

x=>
x.id!==saleId

);

}
else{

sale.total=

sale.items.reduce(

(sum,item)=>

sum+

(
item.qty*
item.price
),

0

);

}

localStorage.setItem(

"pos_sales",

JSON.stringify(
sales
)

);

reload();

renderSalesAdminTable();

}

);

}

// RENDERING PERMISION CHECK//

const currentUser =

JSON.parse(

localStorage.getItem(
"user"
)

);

const canManageSales =thisUser.access==="Administrator";




document
.getElementById(
    "tableViewLink"
)
.addEventListener(
    "click",

() => {

if(

canManageSales

){

renderSalesAdminTable();

}

else{

renderSales();

}

});

//INITIALIZING FUNCTION//

function reload(){
//renderSalesAdminTable();
//renderSalesTable();
renderSales();
calculateTodaySales();
calculateMonthlySales();
}

reload();


/*==================================
SIDEBAR
==================================*/

const sidebar=

document.getElementById(
"sidebar"
);

const overlay=

document.getElementById(
"sidebarOverlay"
);

const menuToggle=

document.getElementById(
"menuToggle"
);


menuToggle.onclick=()=>{

sidebar.classList.toggle(
"show"
);

overlay.classList.toggle(
"show"
);

};


overlay.onclick=()=>{

sidebar.classList.remove(
"show"
);

overlay.classList.remove(
"show"
);

};


/*==================================
LINK EVENTS
==================================*/
document
.getElementById(
"salesCardsViewLink"
)

.addEventListener(

"click",

()=>{

renderSales();

closeSidebar();

}

);


document
.getElementById(
"todayDataLink"
)

.addEventListener(

"click",

()=>{

renderTodaySales();

closeSidebar();

}

);


document
.getElementById(
"thisMonthDataLink"
)

.addEventListener(

"click",

()=>{

renderMonthlySales();

closeSidebar();

}

);


/*==================================
SYNC STATS
==================================*/

function syncSidebarStats(){

document
.getElementById(
"sideTransactions"
)

.textContent=

document
.getElementById(
"totalTransactions"
)

.textContent;


document
.getElementById(
"sideRevenue"
)

.textContent=

document
.getElementById(
"totalRevenue"
)

.textContent;


document
.getElementById(
"sideToday"
)

.textContent=

document
.getElementById(
"todaySales"
)

.textContent;


document
.getElementById(
"sideMonth"
)

.textContent=

document
.getElementById(
"monthlySales"
)

.textContent;

}

const salesBtn =document.getElementById('salesCardsViewLink');
salesBtn.addEventListener('click',renderSalesAdminTable);
setInterval(
syncSidebarStats,
500
);
function testa(){
    return(ineligibleMessage);
}

