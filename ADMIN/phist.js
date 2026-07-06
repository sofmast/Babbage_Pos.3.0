

/* ======================================
BABBAGE POS - PURCHASE TABLE LOGIC
====================================== */

/* ===============================
DATA ACCESS LAYER
=============================== */

function getPurchases(){
return JSON.parse(localStorage.getItem("pos_purchases")) || [];
}

function savePurchases(data){
localStorage.setItem("pos_purchases", JSON.stringify(data));
}

function getProducts(){
return JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts(data){
localStorage.setItem("products", JSON.stringify(data));
}

/* ===============================
STATE
=============================== */

let activePurchaseId = null;

/* ===============================
UTILS
=============================== */

function calculateTotal(items){
return items.reduce((sum, item) => {
return sum + (Number(item.qty) * Number(item.costPrice));
}, 0);
}

/* ===============================
RENDER PURCHASE LIST
=============================== */

const tableBody = document.getElementById("purchaseTableBody");
const searchInput = document.getElementById("purchaseSearch");

function renderPurchases(){

const purchases = getPurchases();
const keyword = searchInput.value.toLowerCase();

tableBody.innerHTML = "";

const filtered = purchases.filter(p => {

return (
(p.id || "").toLowerCase().includes(keyword) ||
(p.supplier || "").toLowerCase().includes(keyword) ||
(p.date?.display || "").toLowerCase().includes(keyword)
);

});

if(filtered.length === 0){
tableBody.innerHTML = `
<tr>
<td colspan="7" style="text-align:center;padding:20px;">
No purchases found
</td>
</tr>
`;
return;
}

filtered.forEach(p => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${p.id}</td>
<td>${p.supplier}</td>
<td>${p.date?.display || ""}</td>
<td>${p.items?.length || 0}</td>
<td>${p.total || 0}</td>

<td>
<button class="action-btn view-btn" data-id="${p.id}">
<i class="fas fa-eye"></i>
</button>
</td>

<td>
<button class="action-btn delete-btn" data-id="${p.id}">
<i class="fas fa-trash"></i>
</button>
</td>
`;

tableBody.appendChild(row);

});

/* attach events safely */
attachRowEvents();
}

/* ===============================
EVENT DELEGATION
=============================== */

function attachRowEvents(){

document.querySelectorAll(".view-btn").forEach(btn => {
btn.onclick = () => openPurchase(btn.dataset.id);
});

document.querySelectorAll(".delete-btn").forEach(btn => {
btn.onclick = () => deletePurchase(btn.dataset.id);
});

}

/* ===============================
OPEN PURCHASE MODAL
=============================== */

const modal = document.getElementById("purchaseActionModal");
const closeModalBtn = document.getElementById("closePurchaseModal");

function openPurchase(id){

const purchases = getPurchases();
const purchase = purchases.find(p => p.id === id);

if(!purchase) return;

activePurchaseId = id;

document.getElementById("receiptTitle").innerText = purchase.id;
document.getElementById("purchaseSupplier").innerText = purchase.supplier;
document.getElementById("purchaseDate").innerText = purchase.date?.display || "";
document.getElementById("purchaseTotal").innerText = purchase.total;

renderItems(purchase.items || []);

modal.classList.add("show");
}

closeModalBtn.onclick = () => {
modal.classList.remove("show");
};

/* ===============================
RENDER ITEMS
=============================== */

function renderItems(items){

const body = document.getElementById("purchaseItemsTable");
body.innerHTML = "";

items.forEach((item, index) => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${item.name}</td>
<td>${item.qty}</td>
<td>${item.costPrice}</td>
<td>${item.qty * item.costPrice}</td>
<td>
<button class="action-btn delete-btn" data-index="${index}">
<i class="fas fa-trash"></i>
</button>
</td>
`;

body.appendChild(row);

});

document.querySelectorAll("[data-index]").forEach(btn => {
btn.onclick = () => deleteItem(Number(btn.dataset.index));
});

}

/* ===============================
DELETE ITEM (WITH RE-CALC)
=============================== */

function deleteItem(index){

const purchases = getPurchases();
const purchase = purchases.find(p => p.id === activePurchaseId);

if(!purchase) return;

purchase.items.splice(index, 1);

purchase.total = calculateTotal(purchase.items);

savePurchases(purchases);

openPurchase(activePurchaseId);
renderPurchases();
}

/* ===============================
DELETE PURCHASE
=============================== */

function deletePurchase(id){

if(!confirm("Delete this purchase?")) return;

let purchases = getPurchases();

/* OPTIONAL: stock reversal hook */
const target = purchases.find(p => p.id === id);

/* If you later want strict inventory rollback:
   target.items.forEach(item => rollbackStock(item));
*/

purchases = purchases.filter(p => p.id !== id);

savePurchases(purchases);

modal.classList.remove("show");

renderPurchases();
}

/* ===============================
EDIT PURCHASE BUTTON (HOOK)
=============================== */

document.getElementById("editPurchaseBtn").onclick = () => {
alert("Edit mode will be added next layer (inline editor modal).");
};

/* ===============================
DELETE FROM MODAL
=============================== */

document.getElementById("deletePurchaseBtn").onclick = () => {
if(activePurchaseId){
deletePurchase(activePurchaseId);
}
};

/* ===============================
INIT
=============================== */

searchInput.addEventListener("input", renderPurchases);

renderPurchases();

