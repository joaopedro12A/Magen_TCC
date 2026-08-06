const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const fileList = document.getElementById('fileList');
let files = [];

browseBtn.addEventListener('click', ()=> fileInput.click());

['dragenter','dragover'].forEach(evt=>{
  dropzone.addEventListener(evt, (e)=>{
    e.preventDefault(); e.stopPropagation();
    dropzone.classList.add('dragover');
  });
});
['dragleave','drop'].forEach(evt=>{
  dropzone.addEventListener(evt, (e)=>{
    e.preventDefault(); e.stopPropagation();
    dropzone.classList.remove('dragover');
  });
});
dropzone.addEventListener('drop', (e)=>{
  const dropped = Array.from(e.dataTransfer.files);
  addFiles(dropped);
});
fileInput.addEventListener('change', ()=>{
  addFiles(Array.from(fileInput.files));
  fileInput.value = '';
});

function addFiles(newFiles){
  newFiles.forEach(f => files.push(f));
  renderFileList();
}
function removeFile(idx){
  files.splice(idx,1);
  renderFileList();
}
function fileIcon(name){
  const ext = name.split('.').pop().toLowerCase();
  if(['csv','xls','xlsx'].includes(ext)) return '📊';
  if(['png','jpg','jpeg'].includes(ext)) return '🖼️';
  return '📄';
}
function renderFileList(){
  fileList.innerHTML = '';
  files.forEach((f, idx)=>{
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
      <span class="fname">${fileIcon(f.name)} ${f.name}</span>
      <button type="button" class="remove" data-idx="${idx}">✕</button>
    `;
    fileList.appendChild(item);
  });
  fileList.querySelectorAll('.remove').forEach(btn=>{
    btn.addEventListener('click', ()=> removeFile(parseInt(btn.dataset.idx)));
  });
}

// Form submit
const form = document.getElementById('buildingForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

form.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('buildingName').value.trim();
  if(!name){
    document.getElementById('buildingName').focus();
    document.getElementById('buildingName').style.borderColor = '#dc2626';
    return;
  }
  submitBtn.classList.add('loading');
  submitBtn.textContent = 'Enviando...';

  setTimeout(()=>{
    submitBtn.classList.remove('loading');
    submitBtn.innerHTML = '📤 Enviar';
    toast.classList.add('show');
    setTimeout(()=> toast.classList.remove('show'), 3200);
  }, 1300);
});

document.getElementById('cancelBtn').addEventListener('click', ()=>{
  form.reset();
  files = [];
  renderFileList();
  document.getElementById('buildingType').classList.add('placeholder');
});
