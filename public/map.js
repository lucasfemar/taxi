let map;

async function initMap() {
    //@ts-ignore
    const { Map } = await google.maps.importLibrary('maps');

    map = new Map(document.getElementById('map'), {
        center: { lat: -23.666363, lng: -46.653302 }, //-23.666363, -46.653302
        zoom: 17,
    });
}

initMap();
