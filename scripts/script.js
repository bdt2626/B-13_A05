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
        <div class="col-span-full flex justify-center items-center h-[400px]">
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

        
        filteredData.forEach(idd => createCard(idd));

        
        issueCounter.innerText = filteredData.length;

    } catch (error) {
        
        allIssues.innerHTML = `<p class="text-center text-red-500 w-full">Failed to load issues. Please try again.</p>`;
    }
}


function createCard(idd) {
  
    const div = document.createElement("div");

    div.innerHTML = `
    <div class="card bg-base-100 shadow-md border-t-4 w-80 min-h-[300px] 
    ${idd.status.toLowerCase() === 'closed' ? 'border-red-500' : 'border-green-500'}" 
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
            <p class="text-sm text-gray-500">${idd.description}</p>

            <div class="flex gap-2 items-center">
                ${idd.labels.map(label => `
                    <span class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-500">${label}</span>
                `).join('')}
            </div>
        </div>

        <div class="border-t px-6 py-2 text-sm text-gray-500 flex justify-between items-center">
            <div><p><span>#1 </span>by ${idd.author}</p></div>
            <div><p>${idd.createdAt}</p></div>
        </div>
        <div class="px-6 pb-2 text-sm text-gray-500 flex justify-between items-center">
            <div><p>assignee: <span>${idd.assignee}</span></p></div>
            <div><p>${idd.updatedAt}</p></div>
        </div>
    </div>
    `;

    allIssues.appendChild(div);
}

async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchText = searchInput.value.toLowerCase().trim();
    
    const activeBtn = document.querySelector('.filter-btn.btn-primary');
    const activeTab = activeBtn ? activeBtn.innerText.toLowerCase() : 'all';

    showLoading();

    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const mrData = await res.json();

        allIssues.innerHTML = "";

        const searchedData = mrData.data.filter(idd => {
            const matchesStatus = (activeTab === 'all' || idd.status.toLowerCase() === activeTab);
            
            const matchesText = idd.title.toLowerCase().includes(searchText) || 
                                idd.description.toLowerCase().includes(searchText);

            return matchesStatus && matchesText;
        });

        if (searchedData.length === 0) {
            allIssues.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                    <p class="text-xl font-semibold">No matches found</p>
                    <p>Try searching for something else or changing your filter.</p>
                </div>
            `;
        } else {
            searchedData.forEach(idd => createCard(idd));
        }

        issueCounter.innerText = searchedData.length;

    } catch (error) {
        console.error("Search Error:", error);
        allIssues.innerHTML = `
            <div class="col-span-full text-center py-20 text-red-500">
                <p>Something went wrong with the search. Please try again.</p>
            </div>
        `;
    }
}




allIssuesLoad();