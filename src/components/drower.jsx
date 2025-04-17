import { useState } from "react"

const Drawer = () => {

    const [showOrClose, setShowOrClose] = useState(true)

    return (
        <div>
            {
                showOrClose ?
                    (
                        <>
                            <div className="d-flex flex-column gap-3 p-2 shadow-sm bg-white heigth-drawer width-drawer">
                                <div className="d-flex justify-content-between w-100">
                                    <h2 className="p-0 fs-5 fw-bold mt-auto mb-auto">image-switch</h2>
                                    <img onClick={() => setShowOrClose(false)} src="/close.png" className="close mt-auto mb-auto" alt="logo" />
                                </div>

                                <div role="button" className="btn btn-outline-info d-flex gap-2 w-50">
                                    <i className="fas fs-4 fa-plus mt-auto mb-auto"></i>
                                    <p className="fw-bold mt-auto mb-auto">Novo</p>
                                </div>
                                {
                                    /** DEpois vou implementar */
                                }
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <div className="d-flex flex-column gap-3 p-2 shadow-sm bg-white heigth-drawer">
                                <img onClick={() => setShowOrClose(true)} src="/logo.png" className="logo rounded-circle" alt="logo" />
                                <img onClick={() => setShowOrClose(true)} src="/open.png" className="open" alt="logo" />
                            </div>
                        </>
                    )
            }
        </div>
    )
}
export default Drawer