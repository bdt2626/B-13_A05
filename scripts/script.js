const allIssues = document.getElementById("all-issues");
const issueCounter = document.getElementById("issue-counter")


function handleButtonClick(buttonName) {
    
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(button => {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline');
    });

    const clickedButton = document.getElementById(`btn-${buttonName}`);
    clickedButton.classList.add('btn-primary');
    clickedButton.classList.remove('btn-outline');

    
    allIssuesLoad(buttonName); 
}


function showLoading() {
    allIssues.innerHTML = `
        <div class="col-span-full flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
    `;
}
    
async function allIssuesLoad(statusName = 'all') {
    showLoading(); 

    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const mrData = await res.json();

        
        allIssues.innerHTML = ""; 

        const filteredData = mrData.data.filter(idd => {
            if (statusName === 'all') return true;
            return idd.status.toLowerCase() === statusName.toLowerCase();
        });

        
        filteredData.forEach(idd => {
            createCard(idd);
        });

        issueCounter.innerText = filteredData.length;

    } catch (error) {
        allIssues.innerHTML = `<p class="text-red-500">Error loading issues.</p>`;
    }
}


function createCard(idd) {
    const div = document.createElement("div");

    // Add pointer cursor and the click event to open the modal
    div.className = "cursor-pointer transition-transform hover:scale-[1.01]";
    div.onclick = () => openDetails(idd);

    div.innerHTML = `
    <div class="card bg-base-100 shadow-md border-t-4 w-80 min-h-[300px] 
    ${idd.status.toLowerCase() === 'closed' ? 'border-purple-800' : 'border-green-500'}" 
    id="single-issue">

        <div class="card-body">
            <div class="flex justify-between items-center">
                <p class="text-sm text-gray-500 hidden">${idd.status}</p>

                <div class="flex items-center justify-center">
                    <img src="${idd.priority.toLowerCase() === 'low' ? './images/Closed-Status.png' : './images/Open-Status.png'}">
                </div>

                <span class="badge 
                    ${idd.priority.toLowerCase() === 'high' ? 'bg-[#FEECEC] text-[#EF4444]' : 
                    idd.priority.toLowerCase() === 'medium' ? 'bg-[#FFFBEB] text-[#D97706]' : 
                    'bg-[#F3F4F6] text-[#6B7280]'}">
                    ${idd.priority}
                </span>
            </div>

            <h2 class="card-title text-base">${idd.title}</h2>
            <p class="text-sm text-gray-500 line-clamp-2">${idd.description}</p>

            <div class="flex gap-2 items-center flex-wrap">
                ${idd.labels.map(label => `
                    <span class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-500 text-xs text-white">${label}</span>
                `).join('')}
            </div>
        </div>

        <div class="border-t px-6 py-2 text-sm text-gray-500 flex justify-between items-center">
            <div><p><span>#1 </span>by ${idd.author}</p></div>
            <div><p>${new Date(idd.createdAt).toLocaleDateString()}</p></div>
        </div>
        <div class="px-6 pb-2 text-sm text-gray-500 flex justify-between items-center">
            <div><p>assignee: <span>${idd.assignee}</span></p></div>
            <div><p>${new Date(idd.updatedAt).toLocaleDateString()}</p></div>
        </div>
    </div>
    `;

    allIssues.appendChild(div);
}

async function handleSearch() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    showLoading(); 

    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const mrData = await res.json();

        // --- 2. CLEAR THE SPINNER HERE TOO ---
        allIssues.innerHTML = ""; 
        // -------------------------------------

        const searchedData = mrData.data.filter(idd => {
             return idd.title.toLowerCase().includes(searchText);
        });

        searchedData.forEach(idd => createCard(idd));
        issueCounter.innerText = searchedData.length;

    } catch (error) {
        console.error(error);
    }
}

async function openDetails(idd) {
    const modal = document.getElementById('issue_modal');
    
  
    document.getElementById('modal-title').innerText = "Loading...";
    document.getElementById('modal-description').innerText = "Please wait while we fetch the latest data.";
    modal.showModal();

    try {
       
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${idd.id}`);
        const result = await res.json();


        
        const data = result.data; 

        document.getElementById('modal-title').innerText = data.title;
        document.getElementById('modal-description').innerText = data.description;
        document.getElementById('modal-assignee').innerText = data.assignee;

        const formattedDate = new Date(data.createdAt).toLocaleDateString('en-GB');
        document.getElementById('modal-meta-info').innerText = `Opened by ${data.author} • ${formattedDate}`;

        

        const status = data.status.toLowerCase();
        const statusBg = status === 'closed' ? 'bg-purple-800' : 'bg-[#10b981]'; 

        document.getElementById('modal-status-badge').innerHTML = `
            <span class="${statusBg} text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                ${status}
            </span>
        `;

        document.getElementById('modal-priority-badge').innerHTML = `
            <span class="bg-[#ef4444] text-white text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest">
                ${data.priority}
            </span>`;

    } catch (error) {
        console.error("Fetch Error:", error);
        document.getElementById('modal-title').innerText = "Error";
        document.getElementById('modal-description').innerText = "Could not load issue details. Please check your internet or API ID.";
    }
}

allIssuesLoad();