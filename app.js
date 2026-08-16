
const COURSES=COURSES_DATA;
const sb=supabase.createClient(window.SUPABASE_URL,window.SUPABASE_PUBLISHABLE_KEY);
let state={attemptId:null,courseId:null,courseName:"",questions:[],answers:{},index:0,timeLeft:3600,timerId:null,submitting:false,candidateName:"",candidateEmail:""};

const $=id=>document.getElementById(id);
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

let pendingCourse=null;
function chooseAssessment(courseId,courseName){
  pendingCourse={courseId,courseName};
  $("home").classList.add("hidden");
  $("candidate").classList.remove("hidden");
  $("candidateError").textContent="";
  $("fullName").value="";
  $("candidateEmail").value="";
  setTimeout(()=>$("fullName").focus(),50);
}
async function startAssessment(courseId,courseName,candidate,email){
  $("loading").classList.remove("hidden");
  const {data,error}=await sb.rpc("start_assessment",{p_course_id:courseId,p_candidate_name:candidate,p_candidate_email:email});
  $("loading").classList.add("hidden");
  if(error){alert(error.message);return}
  if(!data||data.length!==50){alert("Assessment could not produce exactly 50 questions.");return}
  if(state.timerId) clearInterval(state.timerId); state={attemptId:data[0].attempt_id,courseId,courseName,questions:shuffle(data),answers:{},index:0,timeLeft:3600,timerId:null,submitting:false}; startTimer();
  $("candidate").classList.add("hidden");$("quiz").classList.remove("hidden");render();
}
function startTimer(){
  updateTimer();
  state.timerId=setInterval(()=>{
    state.timeLeft--;
    updateTimer();
    if(state.timeLeft<=0){ clearInterval(state.timerId); state.timerId=null; submit(true); }
  },1000);
}
function updateTimer(){
  const el=$("timer"); if(!el)return;
  const m=Math.floor(state.timeLeft/60),s=state.timeLeft%60;
  el.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  el.className=state.timeLeft<=300?"failed":"";
}
function render(){
  const q=state.questions[state.index],selected=state.answers[q.question_id];
  $("courseTitle").textContent=state.courseName;
  $("difficulty").textContent=q.difficulty;
  $("progress").textContent=`Question ${state.index+1} of 50`;
  $("question").textContent=q.question;
  const opts=shuffle([{text:q.option_a,index:0},{text:q.option_b,index:1},{text:q.option_c,index:2},{text:q.option_d,index:3}]);
  q._display=opts;
  $("options").innerHTML=opts.map((o,i)=>`<label class="option"><input type="radio" name="answer" value="${o.index}" ${selected===o.index?"checked":""}><span>${String.fromCharCode(65+i)}.</span><b>${o.text}</b></label>`).join("");
  document.querySelectorAll('input[name=answer]').forEach(r=>r.onchange=()=>state.answers[q.question_id]=Number(r.value));
  $("prev").disabled=state.index===0;$("next").textContent=state.index===49?"Submit Assessment":"Next";
}
function next(){if(state.index===49)return submit();state.index++;render()}
function prev(){if(state.index>0){state.index--;render()}}
async function submit(auto=false){
  if(state.submitting)return;
  if(!auto && !confirm("Submit this assessment? You cannot change answers after submission."))return;
  state.submitting=true;
  if(state.timerId) clearInterval(state.timerId);
  $("next").disabled=true;
  const {data,error}=await sb.rpc("submit_assessment",{p_attempt_id:state.attemptId,p_answers:state.answers});
  $("next").disabled=false;
  if(error){alert(error.message);return}
  $("quiz").classList.add("hidden");$("result").classList.remove("hidden");
  const percentage=Number(data[0].percentage), passed=percentage>=80;
  $("resultCourse").textContent=state.courseName;
  $("resultTitle").textContent=auto?"Time expired":"Assessment complete";
  $("resultBadge").textContent=passed?"PASSED":"NOT PASSED";
  $("resultBadge").className="result-badge "+(passed?"pass":"fail");
  $("scoreNumber").textContent=`${percentage}%`;
  $("scoreRing").style.setProperty("--score-angle",`${percentage*3.6}deg`);
  $("correctCount").textContent=data[0].score;
  $("totalCount").textContent=data[0].total;
  $("candidateSummary").textContent=state.candidateName ? `Candidate: ${state.candidateName}` : "";
  $("resultHeadline").textContent=passed?"Excellent work — assessment passed":"Assessment completed";
  $("resultMessage").textContent=passed
    ? "You achieved the required 80% passing mark. Your assessment result has been securely recorded."
    : "You completed the assessment, but your score is below the required 80% passing mark. Your result has been securely recorded.";
}
async function adminLogin(){
  const email=prompt("Admin email:");if(!email)return;
  const password=prompt("Admin password:");if(!password)return;
  const {error}=await sb.auth.signInWithPassword({email,password});
  if(error){alert(error.message);return}
  $("home").classList.add("hidden");$("adminPanel").classList.remove("hidden");
}
async function exportAll(){
  const {data,error}=await sb.rpc("admin_export_results");
  if(error){alert(error.message);return}
  if(!data.length){alert("No submitted responses yet.");return}
  const rows=data.map(r=>({
    Attempt_ID:r.attempt_id,Candidate:r.candidate_name,Candidate_Email:r.candidate_email,Course:r.course,
    Difficulty:r.difficulty,Question_Number:r.question_number,Question_ID:r.question_id,Question:r.question,
    Selected_Answer:r.selected_answer,Correct_Answer:r.correct_answer,Result:r.result,
    Score:r.score,Total:r.total,Percentage:r.percentage,Started:r.started_at,Submitted:r.submitted_at
  }));
  const ws=XLSX.utils.json_to_sheet(rows),wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"All Responses");
  XLSX.writeFile(wb,"AWS_Connect_All_Responses.xlsx");
}
function backHome(){if(state.timerId)clearInterval(state.timerId);state.timerId=null;$("result").classList.add("hidden");$("candidate").classList.add("hidden");$("quiz").classList.add("hidden");$("home").classList.remove("hidden")}
async function confirmCandidate(){
  const name=$("fullName").value.trim(),email=$("candidateEmail").value.trim();
  if(name.length<2){$("candidateError").textContent="Please enter your full name.";$("fullName").focus();return}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && email.length>0){$("candidateError").textContent="Please enter a valid email address or leave it blank.";return}
  if(!pendingCourse)return;
  await startAssessment(pendingCourse.courseId,pendingCourse.courseName,name,email);
}
document.addEventListener("DOMContentLoaded",()=>{
  $("courses").innerHTML=COURSES.map((c,i)=>`<button class="course" onclick='chooseAssessment(${i+1},${JSON.stringify(c)})'><span>${i+1}</span><div><strong>${c}</strong><small>300 questions • 50 random • 25 Beginner + 25 Intermediate</small></div><em>Start →</em></button>`).join("");
  $("next").onclick=next;$("prev").onclick=prev;$("homeBtn").onclick=backHome;$("beginAssessment").onclick=confirmCandidate;$("cancelCandidate").onclick=backHome;$("fullName").onkeydown=e=>{if(e.key==="Enter")confirmCandidate()};
  $("adminLogin").onclick=adminLogin;$("exportAll").onclick=exportAll;
});
