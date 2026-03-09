const allIssues = document.getElementById("all-issues");



async function allIssuesLoad(){
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    const mrData = await res.json();

    allIssues.innerText = "";

    mrData.data.forEach((idd) => {
    const div = document.createElement("div");

    div.innerHTML = `
    <div class="card bg-base-100 shadow-md border-t-4 border-green-500 w-80" id="single-issue">

          <div class="card-body">

            <!-- Top Row -->
            <div class="flex justify-between items-center">
              <div class="flex items-center justify-center">
                <img src="./images/Open-Status.png">
              </div>

              <span class="badge bg-[#FEECEC] text-[#EF4444]">HIGH</span>
            </div>

           
            <h2 class="card-title text-base">
              ${idd.title}
            </h2>

           <p class="text-sm text-gray-500">
              The navigation menu doesn't collapse properly on mobile devices...
            </p>

           <div class="flex gap-2 mt-2">
              <span class="badge bg-[#FEECEC] border-2 border-[#FECACA] text-[#EF4444]">BUG</span>
              <span class="badge bg-[#FFF8DB] border-2 border-[#FDE68A] text-[#D97706]">HELP WANTED</span>
            </div>

          </div>

        <div class="border-t px-6 py-2 text-sm text-gray-500 flex justify-between items-center">
          <div><p><span>#1 </span>by john_doe</p></div>
          <div><p>2024-01-15T10:30:00Z</p></div>
        </div>
        <div class="px-6 pb-2 text-sm text-gray-500 flex justify-between items-center">
          <div><p>assignee:<span>jane_smith</span></div>
          <div><p>2024-01-15T10:30:00Z</p></div>
        </div>
        

      </div>
    `

    allIssues.appendChild(div);
    });

//     console.log(mrData.data);

//     allIssues.innerText = "";
//    mrData.data.forEach((idd) => {
//     //  console.log(idd.id);
//      const singleIssue = document.getElementById("single-issue")
     
//      allIssues.appendChild (singleIssue);
        
    
//    })

    }


allIssuesLoad();