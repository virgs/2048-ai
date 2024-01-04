import { useEffect } from 'react'

export function GameVictoryModalComponent({ show, dismiss }: { show: boolean; dismiss: () => void }) {
    useEffect(() => {
        if (show) {
            //@ts-ignore
            new bootstrap.Modal('#gameVictoryModal', { focus: true }).show()

            const modalElement = document.getElementById('gameVictoryModal');
            modalElement?.addEventListener('hidden.bs.modal', () => {
                console.log('dismiss')
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
            id="gameVictoryModal"
            tabIndex={-1}
            aria-labelledby="gameVictoryModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <h1 className="modal-title" id="gameVictoryModalLabel" style={{ color: 'lightgreen' }}>
                        You win
                    </h1>
                </div>
            </div>
        </div>
    )
}
