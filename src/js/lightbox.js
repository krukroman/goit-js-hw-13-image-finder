import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

export default function createModal(url) {
  const instance = basicLightbox.create(`
    
      <div>
        <img
          src="${url}"
          alt=""
        />
      </div>
	
`);
  instance.show();
}
