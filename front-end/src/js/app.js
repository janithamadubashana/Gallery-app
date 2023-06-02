const overlay = $('#overlay')
const btnUpLoad = $('#btn-upload')
const btnDownload = $('.btn-dwn')
const main = $('main');
const image = $('.image')
const dropZone = $('#drop-zone');
const cssLoaderHtml = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`

btnDownload.css('background-color','red')

btnUpLoad.on('click', ()=>{
    overlay.removeClass('d-none')
})

overlay.on('click', (eventData)=>{
    if(eventData.target === overlay[0]) overlay.addClass('d-none')
})

$(document).on('keydown', (eventData)=>{
    if (eventData.key === 'Escape' && overlay.hasClass('d-none')){
        overlay.addClass('d-none')
    }
})
main.on('click',image,(evenData)=>{
    console.log(evenData.target)
    $(evenData.target).children().css('visibility','visible')
})
btnDownload.on('click',()=>{
    alert()
})

dropZone.on('dragover',(eventData)=>{
    eventData.preventDefault();
})
dropZone.on('drop',(eventData)=>{
    alert("g")
    eventData.preventDefault();

    const dropFiles = eventData.originalEvent.dataTransfer.files;
    const imageFiles = Array.from(dropFiles)
        .filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) {
        return;
    }
    overlay.addClass("d-none")
    upLoadImage(imageFiles)

})

main.on('click', '.image:not(.loader)', (eventData) =>{
    $(eventData.target).css('border','none')
    eventData.target.requestFullscreen();
})

function upLoadImage(imageFile){
    const formData = new FormData;
    imageFile.forEach(imageFiles => {
        const imageDevElm =  $("<div class='image loader'></div>")
        imageDevElm.append(cssLoaderHtml)
        main.append(imageDevElm)
        formData.append('images',imageFiles)
    })

    const jqxhr = $.ajax('http://localhost:8080/gallery/images/',{
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false  //! By default jQuery uses  application / x-www-form-urlencoded
        //! By default jQuery try to convert data to sString
    })
    jqxhr.done((imageUrlList)=>{
        imageUrlList.forEach(url => {
            const divElm = $('.image.loader').first()
            divElm.css('background-image',`url(${url})`)
            divElm.empty()
            divElm.removeClass('loader')
        })
    })
    jqxhr.always(()=>{
        $('.image.loader').remove();
    })
}
overlay.on('dragover', (eventData) =>{
    eventData.preventDefault()
})
overlay.on('drop', (eventData) =>{
    eventData.preventDefault()
})

function loadImages(){

    const jqxhr = $.ajax('http://localhost:8080/gallery/images/', {
        method: 'GET',
    });
    jqxhr.done((imageList)=> {
        imageList.forEach(url => {
            const imgElm =$(`<div class="image" ></div>`);
            const dButton = $(`<button class="btn-dwn">D</button>`)
            imgElm.append(dButton)


            imgElm.css('background-image',`url(${url})`)
            main.append(imgElm)
        })


    });
    jqxhr.fail(() => {

    })

}

loadImages()