document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:8080/getIds')
    .then(response => response.json())
    .then(data => loadCustomerIds(data['data']));

    const customerIds = document.getElementById('customerIds');

    customerIds.addEventListener('change', function () {
        fetch('http://localhost:8080/getCustomer/' + customerIds.value)
        .then(response => response.json())
        .then(data => { 
            displayCustomerData(data);
        });
        fetch('http://localhost:8080/getOrders/' + customerIds.value)
        .then(response => response.json())
        .then(data => { 
            displayCustomerOrders(data);
        });
    });
});


function loadCustomerIds(data)
{
    const customerIds = document.getElementById('customerIds');
    if(data.length === 0)
    {

        document.getElementById('customerIds').innerHTML = '<option value="" disabled>No customer id found</option>';
        return;
    }
  for (const id of data) {
    const option = document.createElement('option');
    option.value = id.id; 
    option.textContent = id.id; 
    customerIds.appendChild(option);
  }
}

function displayCustomerData(data)
{
    document.getElementById('customer-name').value = data['data'][0].name;
    document.getElementById('company-name').value = data['data'][0].company;
    document.getElementById('customer-city').value = data['data'][0].city;
}

function displayCustomerOrders(data)
{
    const table = document.getElementById('order_table');
    const product_table = document.getElementById('products_table');
    const order_count_label = document.getElementById('order_count');
    // console.log(data['data'].length);
    if(data['data'].length === 0)
    {
        table.innerHTML = '<thead class="bg-gray-50">'
                        +'<tr>'
                        +'<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order Date</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ship Country</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ship City</th>'
                        +'</tr>'
                        +'</thead>' 
                        +'<tbody class="divide-y divide-gray-200 bg-white">'
                        + '<tr><td colspan="4" class="text-center p-4 text-semibold text-md italic">No orders found</td></tr>'
                        +'</tbody>';
        product_table.innerHTML = '<thead class="bg-gray-50">'
                        +'<tr>'
                        +'<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product ID</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit Price</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">% Discount</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discount</th>'
                        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discounted Value</th>'
                        +'</tr>'
                        +'</thead>' 
                        +'<tbody class="divide-y divide-gray-200 bg-white">'
                        + '<tr><td colspan="7" class="text-center p-4 text-semibold text-md italic">No products found</td></tr>'
                        +'</tbody>';
        return;
    }
        table.innerHTML = ''; 
        product_table.innerHTML = '<thead class="bg-gray-50">'
        +'<tr>'
        +'<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product ID</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit Price</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">% Discount</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discount</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discounted Value</th>'
        +'</tr>'
        +'</thead>' 
        +'<tbody class="divide-y divide-gray-200 bg-white">'
        + '<tr><td colspan="7" class="text-center p-4 text-semibold text-md italic">No orders selected</td></tr>'
        +'</tbody>';
        // Create table header only when data is present
        const thead = document.createElement('thead');
        thead.classList.add('bg-gray-50');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order Date</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ship Country</th>
        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Ship City</th>
      `;
      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      let selectedRow = null;
        for (const order of data['data']) {
            const orderDate = new Date(order.order_date);
            const formattedDate = orderDate.toLocaleDateString('en-US', {
            month: 'long', 
            day: 'numeric',  
            year: 'numeric'   
            });

            const row = tbody.insertRow();
    row.addEventListener('click', function() {
        if (selectedRow) {
            selectedRow.classList.remove('bg-gray-300'); 
          }
          selectedRow = this;
          this.classList.add('bg-gray-300');
          //call function 
          fetch('http://localhost:8080/getProducts/' + order.id)
          .then(response => response.json())
          .then(data => { 
            displayOrderProducts(data);
          });
      });


            
    for (let i = 0; i < 4; i++) { 
        const cell = row.insertCell(i);
        cell.classList.add('whitespace-nowrap', 'py-4', 'pl-4', 'pr-3', 'text-sm', 'font-medium', 'text-gray-900');
        cell.textContent =  (i === 1) ? formattedDate : (i === 2) ? order.ship_address : (i === 3) ? order.ship_city : order.id;
      }
    }
        table.appendChild(tbody);
        order_count_label.textContent = "There are "+ data['data'].length + " sales order record(s) for Customer ID: " + customerIds.value;
}

function displayOrderProducts(data)
{
    const table = document.getElementById('products_table');
    const product_count_label = document.getElementById('product_count');
    if(data['data'].length === 0)
    {
        table.innerHTML = '<thead class="bg-gray-50">'
        +'<tr>'
        +'<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product ID</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit Price</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">% Discount</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discount</th>'
        +'<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discounted Value</th>'
        +'</tr>'
        +'</thead>' 
        +'<tbody class="divide-y divide-gray-200 bg-white">'
        + '<tr><td colspan="7" class="text-center p-4 text-semibold text-md italic">No products found</td></tr>'
        +'</tbody>';
        return;
    }
    table.innerHTML = '';   

    const thead = document.createElement('thead');
    thead.classList.add('bg-gray-50');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product ID</th>
    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit Price</th>
    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">% Discount</th>
    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discount</th>
    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Discounted Value</th>
    `;
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    var total_amount = 0;
        var total_discount_price = 0;
        var total_discounted_value = 0;
    for (const product of data['data']) {
        const row = tbody.insertRow();

        var u_price = parseFloat(product.unit_price);
        var formattedPrice = u_price.toFixed(2);
        formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var discount = parseInt(product.discount);
        var formattedDiscount = discount.toFixed(2);
        formattedDiscount = formattedDiscount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var quantity = parseInt(product.quantity);
        var amount = u_price * quantity;
        var formattedAmount = amount.toFixed(2);
        formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var total_discount = (discount / 100) * amount;
        var formattedTotalDiscount = total_discount.toFixed(2);
        formattedTotalDiscount = formattedTotalDiscount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        var discounted_value = amount - total_discount;
        var formattedDiscountedValue = discounted_value.toFixed(2);
        formattedDiscountedValue = formattedDiscountedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        
        total_amount += amount;
        total_discount_price += total_discount;
        total_discounted_value += discounted_value;

        for (let i = 0; i < 7; i++) { 
          

            const cell = row.insertCell(i);
            cell.classList.add('whitespace-nowrap', 'py-4', 'pl-4', 'pr-3', 'text-sm', 'font-medium', 'text-gray-900', 'text-right');
            cell.textContent =  (i === 1) ? '₱ '+ formattedPrice : (i === 2) ? quantity : (i === 3) ? formattedDiscount : 
            (i === 4) ? '₱ '+ formattedAmount : (i === 5) ? '₱ '+ formattedTotalDiscount : (i === 6) ? '₱ '+ formattedDiscountedValue : product.id;
        }
    }

    total = total_amount.toFixed(2);
    total = total.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    total_discount_price = total_discount_price.toFixed(2);
    total_discount_price = total_discount_price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    total_discounted_value = total_discounted_value.toFixed(2);
    total_discounted_value = total_discounted_value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    var t_amount = document.getElementById('total_amount');
    t_amount.value = '₱ '+ total;
    var t_discount = document.getElementById('total_discount_price');
    t_discount.value = '₱ '+ total_discount_price;
    var t_discounted_value = document.getElementById('total_discounted_price');
    t_discounted_value.value = '₱ '+ total_discounted_value;
    table.appendChild(tbody);
    product_count_label.textContent = "There are "+ data['data'].length + " product(s) for Order ID: " + data['data'][0].order_id;
}