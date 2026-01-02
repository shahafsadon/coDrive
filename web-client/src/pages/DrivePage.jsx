import TopBar from '../components/layout/TopBar';
import SideMenu from '../components/layout/SideMenu';
import FileGrid from '../components/drive/FileGrid';
import '../components/drive/drive.css';

function DrivePage() {
    return (
        <>
            <TopBar />

            <div className="drive-container">
                <SideMenu />

                <main className="drive-main">
                    <h2 className="drive-title">My Drive</h2>
                    <FileGrid />
                </main>
            </div>
        </>
    );
}

export default DrivePage;
