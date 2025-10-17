const divHTML = `
    <div style="cursor: pointer;display: flex; justify-content: flex-end; margin: 10px 10px 0px 0px;"> <i style="font-size: 28px; color: whitesmoke;" class="fa-solid fa-rectangle-xmark close-transactie"></i> </div>
    <h1 class="h1-add-transactie" style="text-align: center;">Transactie maken</h1>
    <div id="inputs">
        <div style="padding-left: 20px;">
            <span">Je (verzender) Public key:</span>
        <input type="text" id="publicKey" style="all:unset; border: 1px solid #fff; border-radius: 5px; padding:4px 12px ; width: 90% ; overflow:auto; margin-top:3px ;"></input>
        </div>
        <hr style="width: 90%; height:1px; margin: 0px auto;">
        <div style="padding-left: 20px;">
            <span">Je (verzender) Private key:</span>
              <input type="text" id="privateKey" style="all:unset; border: 1px solid #fff; border-radius: 5px; padding:4px 12px ; width: 90% ; overflow:auto; margin-top: 3px;"></input>
        </div>
        <hr style="width: 90%; height:1px; margin: 0px auto;">

        <div style="padding-left: 20px;">
            <span>Ontvanger Public key:</span>
            <input type="text" id="recipientPublicKey" style="all:unset; border: 1px solid #fff; border-radius: 5px; padding:4px 12px ; width: 90% ; overflow:auto; margin-top:3px ;"></input>
        </div>

        <hr style="width: 90%; height:1px; margin: 0px auto;">
        <div style="padding-left: 20px;">
            <span>Bedrag available:</span>
            <div id="walletBalans">123</div>
        </div>
        <div style="padding-left: 20px;">
            <span>Bedrag:</span>
            <input autocomplete="off" id="amount" name="amount" type="number" placeholder="Bedrag" style="all: unset; padding: 6px 12px; border: 2px solid #fff; border-radius: 5px;">
        </div>
        <hr style="width: 90%; height:1px; margin: 0px auto;">
        <div style="width: 100%; display: flex; justify-content: center; align-items: center; padding-bottom: 20px;">
            <button name="submit" type="submit" id="submit-input" style="padding: 10px 16px; cursor: pointer;">Toevoegen</button>
        </div>
    </div>`;

const actionsDiv = document.querySelector('#actions');
const h2 = document.querySelector("#currentDomain");
const blockExplorerBtn = document.querySelector('#blockExplorer');
const searchTransactionBtn = document.querySelector('#searchTransaction');
const createTransactionBtn = document.querySelector('#createTransaction');

const currentDomain = window.location.origin;
const url = new URL(currentDomain); //http://localhost:3001
const port = url.port; //3001

h2.textContent = `Node: ${currentDomain}`;

document.addEventListener('DOMContentLoaded', async () => {
    actionsDiv.style.display = 'flex';
});

createTransactionBtn.addEventListener('click', async () => {
    const blurDiv = document.createElement("div");
    const div = document.createElement("div");
    makeTransactiePopUp(blurDiv, div, divHTML);
    const closeTransactieBtn = div.querySelector(".close-transactie");
    closeTransactieBtn.addEventListener("click", () => {
        closeTransactiepopUp(blurDiv, div);
    });

    const walletBalansDiv = document.querySelector("#walletBalans");
    walletBalansDiv.textContent = `GENOEG COINS`;

    const submitBtn = document.querySelector('#submit-input');
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const selectedUserPrivateKey = div.querySelector("#privateKey").value; //verzender zijn private key
        const amount = parseInt(div.querySelector('#amount').value); //aantal coins
        const recipientPublicKey = div.querySelector("#recipientPublicKey").value; //ontvanger zijn public key
        const selectedUserPublicKey = div.querySelector("#publicKey").value; //verzender zijn public key

        if(recipientPublicKey==null || selectedUserPublicKey == null || selectedUserPrivateKey == null || isNaN(amount)){
            alert("Ongeldige gegevens.");
            closeTransactiepopUp(blurDiv, div);
            return;
        };

        try {
            //naar backend
            const response = await fetch(`${currentDomain}/transaction/create-and-broadcast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderPublicKey: selectedUserPublicKey, senderPrivateKey: selectedUserPrivateKey, recipientPublicKey, amount })
            });

            const result = await response.json();
            alert(result.msg);
            console.log(result)
            if (result.success) closeTransactiepopUp(blurDiv, div);
        } catch (error) {
            console.log(error);
            alert("Transactie error.");
        };
    });
});

// *explore:
blockExplorerBtn.addEventListener("click", () => {
    window.open(`${currentDomain}/explore/blockchain`, '_blank');
});

//functions
function makeTransactiePopUp(blurDiv, div, context) {
    blurDiv.classList.add("blurr");
    div.innerHTML = context;
    div.classList.add('transactie-card');
    document.body.appendChild(blurDiv)
    document.body.appendChild(div);
};
function closeTransactiepopUp(blurDiv, div) {
    blurDiv.remove()
    div.remove()
};