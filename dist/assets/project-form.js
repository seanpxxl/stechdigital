const form=document.querySelector('[data-project-form]');
const steps=[...document.querySelectorAll('[data-form-step]')];
const label=document.querySelector('[data-step-label]');
const bar=document.querySelector('[data-form-progress]');
const submit=document.querySelector('[data-form-submit]');
let current=0;
function showStep(index){current=Math.max(0,Math.min(index,steps.length-1));steps.forEach((step,i)=>step.hidden=i!==current);if(label)label.textContent='Step '+(current+1)+' of '+steps.length;if(bar)bar.style.width=((current+1)/steps.length*100)+'%';document.querySelector('.project-form-card')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
function validStep(){for(const control of steps[current].querySelectorAll('input,select,textarea')){if(!control.checkValidity()){control.reportValidity();control.focus();return false;}}return true;}
document.querySelectorAll('[data-form-next]').forEach(button=>button.addEventListener('click',()=>{if(validStep())showStep(current+1);}));
document.querySelectorAll('[data-form-back]').forEach(button=>button.addEventListener('click',()=>showStep(current-1)));
form?.addEventListener('submit',event=>{if(!form.checkValidity()){event.preventDefault();const invalid=form.querySelector(':invalid');const step=steps.findIndex(item=>item.contains(invalid));if(step>=0)showStep(step);invalid?.reportValidity();return;}sessionStorage.setItem('stech-project-sent','true');if(typeof window.gtag==='function')window.gtag('event','project_form_submit');if(submit){submit.disabled=true;submit.textContent='Sending…';}});
showStep(0);