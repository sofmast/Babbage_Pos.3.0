 // =====================================
// ELEMENTS
// =====================================

const purchaseHistory =
document.getElementById(
"purchaseHistory"
);

const searchPurchase =
document.getElementById(
"searchPurchase"
);

const purchaseModal =
document.getElementById(
"purchaseModal"
);

const purchaseDetails =
document.getElementById(
"purchaseDetails"
);

const closePurchaseModal =
document.getElementById(
"closePurchaseModal"
);
// RENDER STATS ROW//
function updatePurchaseStats(rows){

    const panel =
        document.getElementById(
            "purchaseStatsPanel"
        );

    if(
        currentView !== "items"
        ||
        rows.length === 0
    ){

        panel.classList.remove(
            "show"
        );

        return;
    }

    let totalCost = 0;

    let totalRetail = 0;

    rows.forEach(row => {

        totalCost +=
            row.totalCost;

        // retail value from product

        const product =
            JSON.parse(
                localStorage.getItem(
                    "pos_products"
                ) || "[]"
            ).find(

                p =>

                p.name === row.product

            );

        if(product){

            totalRetail +=
                row.qty *
                product.price;
        }

    });

    const profit =
        totalRetail -
        totalCost;

    document.getElementById(
        "statsCost"
    ).textContent =
        formatCurrency(
            totalCost
        );

    document.getElementById(
        "statsRetail"
    ).textContent =
        formatCurrency(
            totalRetail
        );

    document.getElementById(
        "statsProfit"
    ).textContent =
        formatCurrency(
            profit
        );

    panel.classList.add(
        "show"
    );

}

// =====================================
// GET PURCHASES
// =====================================

function getPurchases(){

return JSON.parse(

localStorage.getItem(
"pos_purchases"
)

) || [];

}

// =====================================
// DELETE PURCHASE
// =====================================

function deletePurchase(id){

if(!confirm("Delete this purchase? Stock will be reversed.")) return;

let purchases = getPurchases();

const target = purchases.find(p => p.id === id);

/* 🔥 REVERSE STOCK BEFORE DELETE */
if(target){
reversePurchaseStock(target);
}

purchases = purchases.filter(p => p.id !== id);

savePurchases(purchases);

modal.classList.remove("show");

renderPurchases();

}

// =====================================
// VIEW PURCHASE
// =====================================

function viewPurchase(id){

const purchase =
getPurchases().find(

p => p.id === id

);

if(!purchase) return;

purchaseDetails.innerHTML = `

<h3>
${purchase.id}
</h3>

<p>
Supplier:
<strong>
${purchase.supplier}
</strong>
</p>

<p>
Date:
 Date:
${formatDate(purchase)}
</p>

<hr><br>

${purchase.items.map(item => `

<div class="purchase-detail-item">

<div>

${item.name}

</div>

<div>

${item.qty}
×
K${item.costPrice}

</div>

</div>

`).join("")}

<div class="purchase-total">

Total:
K${purchase.total.toFixed(2)}

</div>

`;

purchaseModal
.classList
.add("show");

}

// =====================================
// PRINT PURCHASE
// =====================================

function printPurchase(id){

const purchase =
getPurchases().find(

p => p.id === id

);

if(!purchase) return;

const win =
window.open(
"",
"_blank"
);

win.document.write(`

<h2>
Purchase Receipt
</h2>

<p>
Reference:
${purchase.id}
</p>

<p>
Supplier:
${purchase.supplier}
</p>

<p>
Date:
${new Date(
purchase.date
).toLocaleString()}
</p>

<hr>

${purchase.items.map(item => `

<p>

${item.name}

-

${item.qty}

×

K${item.costPrice}

</p>

`).join("")}

<hr>

<h3>

Total:
K${purchase.total.toFixed(2)}

</h3>

`);

win.print();

}

// =====================================
// RENDER
// =====================================

function renderPurchases(){

const purchases =
getPurchases();

document
.getElementById(
    "purchaseStatsPanel"
)
.classList.remove(
    "show"
);

if(
purchases.length === 0
){

purchaseHistory.innerHTML = `

<p class="empty">

No purchases found

</p>

`;

return;

}

purchaseHistory.innerHTML = `

<div class="table-wrapper">

<table
class="purchase-table">

<thead>

<tr>

<th>Date</th>

<th>Reference</th>

<th>Supplier</th>

<th>Items</th>

<th>Total</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

${purchases.map(purchase => `

<tr>

<td>

${formatDate(purchase)}

</td>

<td>

${purchase.id}

</td>

<td>

${purchase.supplier}

</td>

<td>

${purchase.items.length}

</td>

<td>

K${purchase.total.toFixed(2)}

</td>

<td>

<div class="actions">

<button
class="action-btn view-btn"
onclick="viewPurchase('${purchase.id}')">

👁

</button>

<button
class="action-btn print-btn"
onclick="printPurchase('${purchase.id}')">

🖨

</button>

<button
class="action-btn delete-btn"
onclick="deletePurchase('${purchase.id}')">

🗑

</button>

</div>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

}

//======================================
//SERCH PURCHASE SAMMARRY
//=====================================

function searchPurchaseSummary(keyword){

    const purchases =
        getPurchases();

    const filtered =
        purchases.filter(purchase => {

            return (

                purchase.id
                    .toLowerCase()
                    .includes(keyword)

                ||

                purchase.supplier
                    .toLowerCase()
                    .includes(keyword)

                ||

                formatDate(purchase)
                    .toLowerCase()
                    .includes(keyword)

            );

        });

    renderFiltered(filtered);

}

//======================================
// Item Search
//======================================

function searchPurchaseItems(keyword){

    const rows =
        getPurchaseItems();

    const filtered =
        rows.filter(row => {

            return (

                row.purchaseId
                    .toLowerCase()
                    .includes(keyword)

                ||

                row.supplier
                    .toLowerCase()
                    .includes(keyword)

                ||

                row.product
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(row.qty)
                    .includes(keyword)

                ||

                String(row.unitCost)
                    .includes(keyword)

                ||

                String(row.totalCost)
                    .includes(keyword)

                ||

                row.date
                    .toLowerCase()
                    .includes(keyword)

            );

        });

    renderFilteredPurchaseItems(filtered);
    updatePurchaseStats(
    rows
);
updatePurchaseStats(
    rows
);
}


//======================================
// ITERM FILTER RENDER
//======================================

function renderFilteredPurchaseItems(rows){

    if(rows.length === 0){

        purchaseHistory.innerHTML = `

        <p class="empty">

            No matching items found

        </p>

        `;

        return;
    }

    purchaseHistory.innerHTML = `

    <div class="table-wrapper">

        <table class="purchase-table">

            <thead>

                <tr>

                    <th>#</th>

                    <th>Purchase ID</th>

                    <th>Date</th>

                    <th>Supplier</th>

                    <th>Product</th>

                    <th>Qty</th>

                    <th>Unit Cost</th>

                    <th>Total Cost</th>

                </tr>

            </thead>

            <tbody>

                ${rows.map((row,index)=>`

                <tr>

                    <td>${index+1}</td>

                    <td>${row.purchaseId}</td>

                    <td>${row.date}</td>

                    <td>${row.supplier}</td>

                    <td>${row.product}</td>

                    <td>${row.qty}</td>

                    <td>${formatCurrency(row.unitCost)}</td>

                    <td>${formatCurrency(row.totalCost)}</td>

                </tr>

                `).join("")}

            </tbody>

        </table>

    </div>

    `;

}

// =====================================
// SEARCH
// =====================================

if(searchPurchase){

searchPurchase.addEventListener(

    "input",

    () => {

        const keyword =
            searchPurchase.value
            .toLowerCase()
            .trim();

        if(currentView === "summary"){

            searchPurchaseSummary(keyword);

        }else{

            searchPurchaseItems(keyword);

        }

    }

);
}

function renderFiltered(data){

if(data.length === 0){

purchaseHistory.innerHTML = `

<p class="empty">

No matching purchases

</p>

`;

return;

}

purchaseHistory.innerHTML = `

<div class="table-wrapper">

<table
class="purchase-table">

<thead>

<tr>

<th>Date</th>

<th>Reference</th>

<th>Supplier</th>

<th>Items</th>

<th>Total</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

${data.map(purchase => `

<tr>

<td>
 Date: ${formatDate(purchase.date)}
</td>

<td>
${purchase.id}
</td>

<td>
${purchase.supplier}
</td>

<td>
${purchase.items.length}
</td>

<td>
K${purchase.total.toFixed(2)}
</td>

<td>

<div class="actions">

<button
class="action-btn view-btn"
onclick="viewPurchase('${purchase.id}')">

👁

</button>

<button
class="action-btn print-btn"
onclick="printPurchase('${purchase.id}')">

🖨

</button>

<button
class="action-btn delete-btn"
onclick="deletePurchase('${purchase.id}')">

🗑

</button>

</div>

</td>

</tr>

`).join("")}

</tbody>

</table>

</div>

`;

}

// =====================================
// CLOSE MODAL
// =====================================

closePurchaseModal
.addEventListener(

"click",

() => {

purchaseModal
.classList
.remove("show");

}

);

// =====================================
// INITIALIZE
// =====================================
getPurchaseItems();
renderPurchases()
renderPurchaseItems()
renderCurrentView()