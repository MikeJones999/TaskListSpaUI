

import { Toaster as ToasterComponent } from 'react-hot-toast';

export default function ToastWrapper() {
  return (
    <div>
      
            <ToasterComponent 
                position="top-center"
                containerStyle={{
                    top: 100, // Brings it below the navbar
                }}
                toastOptions={{
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
           />
    </div>
  )
}
