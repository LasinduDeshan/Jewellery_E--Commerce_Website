'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CustomizeHero } from '../../components/customize/CustomizeHero';
import { SapphireGallery } from '../../components/customize/SapphireGallery';
import { CutsGallery } from '../../components/customize/CutsGallery';
import { BirthstoneGuide } from '../../components/customize/BirthstoneGuide';
import { ArtisanalProcess } from '../../components/customize/ArtisanalProcess';
import { CustomizeStudioModal } from '../../components/customize/CustomizeStudioModal';
import { SubmissionSuccessModal } from '../../components/customize/SubmissionSuccessModal';
import { CustomizeScroller } from '../../components/customize/CustomizeScroller';

interface SubmissionSuccessData {
  ticketId: string;
  customerName: string;
  email: string;
  jewellerySummary: {
    type: string;
    metal: string;
    sapphire: string;
    cut: string;
  };
}

export default function CustomizePage() {
  // State for selections across all interactive sections
  const [selectedJewelleryType, setSelectedJewelleryType] = useState<string>('ring');
  const [selectedMetal, setSelectedMetal] = useState<string>('Silver');
  const [selectedSapphire, setSelectedSapphire] = useState<string>('Royal Blue Sapphire');
  const [selectedCut, setSelectedCut] = useState<string>('Oval Cut');

  // Studio modal state
  const [studioOpen, setStudioOpen] = useState(false);

  // Success modal state
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    ticketId: string;
    customerName: string;
    email: string;
    jewellerySummary: {
      type: string;
      metal: string;
      sapphire: string;
      cut: string;
    };
  }>({
    isOpen: false,
    ticketId: '',
    customerName: '',
    email: '',
    jewellerySummary: {
      type: '',
      metal: '',
      sapphire: '',
      cut: '',
    },
  });

  const openStudio = () => setStudioOpen(true);

  const openDirectWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Ceylon Jewels! I am interested in designing a bespoke ${selectedMetal} ${selectedJewelleryType} with a ${selectedSapphire} (${selectedCut}). Can we discuss ideas and a quote?`
    );
    window.open(`https://wa.me/94771234567?text=${msg}`, '_blank');
  };

  const handleSelectSapphireAndOpen = (sapphireName: string) => {
    setSelectedSapphire(sapphireName);
    setStudioOpen(true);
  };

  const handleSelectCutAndOpen = (cutName: string) => {
    setSelectedCut(cutName);
    setStudioOpen(true);
  };

  const handleSelectBirthstoneAndOpen = (sapphireName: string) => {
    setSelectedSapphire(sapphireName);
    setStudioOpen(true);
  };

  const handleStudioSuccess = (data: SubmissionSuccessData) => {
    setStudioOpen(false);
    setSuccessModalData({
      isOpen: true,
      ticketId: data.ticketId,
      customerName: data.customerName,
      email: data.email,
      jewellerySummary: data.jewellerySummary,
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Interactive Luxury Scroller Navigation & Top Progress Bar */}
      <CustomizeScroller onOpenStudio={openStudio} />

      <Navbar />

      {/* Hero & Expectations */}
      <CustomizeHero onStartDesigning={openStudio} />

      {/* Sapphire Varieties Gallery */}
      <SapphireGallery
        selectedSapphire={selectedSapphire}
        onSelectSapphire={handleSelectSapphireAndOpen}
        onStartCustomizing={openStudio}
        onOpenWhatsApp={openDirectWhatsApp}
      />

      {/* Sapphire Cuts Gallery */}
      <CutsGallery
        selectedCut={selectedCut}
        onSelectCut={handleSelectCutAndOpen}
      />

      {/* Birthstone Styling Guide */}
      <BirthstoneGuide
        onSelectBirthstoneSapphire={handleSelectBirthstoneAndOpen}
      />

      {/* Our Artisanal Process */}
      <ArtisanalProcess />

      {/* Premium 8-Step Design Studio Popup */}
      <CustomizeStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        onSuccess={handleStudioSuccess}
        initialJewelleryType={selectedJewelleryType}
        initialMetal={selectedMetal}
        initialSapphire={selectedSapphire}
        initialCut={selectedCut}
      />

      {/* Post-Submission Success Confirmation Modal */}
      <SubmissionSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData((prev) => ({ ...prev, isOpen: false }))}
        ticketId={successModalData.ticketId}
        customerName={successModalData.customerName}
        email={successModalData.email}
        jewellerySummary={successModalData.jewellerySummary}
      />

      <Footer />
    </main>
  );
}
