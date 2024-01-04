import { useEffect } from 'react'

export function GameOverModalComponent({ show, dismiss }: { show: boolean; dismiss: () => void }) {
    useEffect(() => {
        if (show) {
            //@ts-ignore
            new bootstrap.Modal('#gameOverModal', { focus: true }).show()
            document.getElementById('gameOverModal')?.addEventListener('hidden.bs.modal', () => {
                dismiss()
            })
        }
    }, [show])
    if (!show) {
        return <></>
    }
    return (
        <div
            className="modal fade"
            id="gameOverModal"
            tabIndex={-1}
            aria-labelledby="gameOverModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <h1 className="modal-title fs-5" id="gameOverModalLabel">
                        You lost
                    </h1>
                </div>
            </div>
        </div>
    )
}
