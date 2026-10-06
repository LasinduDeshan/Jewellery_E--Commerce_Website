'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { CustomizeHero } from '../../components/customize/CustomizeHero';
import { SapphireGallery } from '../../components/customize/SapphireGallery';
import { CutsGallery } from '../../components/customize/CutsGallery';
import { BirthstoneGuide } from '../../components/customize/BirthstoneGuide';
import { ArtisanalProcess } from '../../components/customize/ArtisanalProcess';
import { CustomizationForm } from '../../components/customize/CustomizationForm';
import { SizeGuideModal } from '../../components/customize/SizeGuideModal';
import { SubmissionSuccessModal } from '../../components/customize/SubmissionSuccessModal';
import { WhatsAppConciergeCTA } from '../../components/customize/WhatsAppConciergeCTA';

export default function CustomizePage() {
  // State for selections across all interactive sections
  const [selectedJewelleryType, setSelectedJewelleryType] = useState<string>('ring');
  const [selectedMetal, setSelectedMetal] = useState<string>('18K Rose Gold');
  const [selectedSapphire, setSelectedSapphire] = useState<string>('Royal Blue Sapphire');
  const [selectedCut, setSelectedCut] = useState<string>('Oval Cut');

  // Modals state
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
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

  const scrollToForm = () => {
    const el = document.getElementById('customization-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openDirectWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Ceylon Jewels! I am interested in designing a bespoke ${selectedMetal} ${selectedJewelleryType} with a ${selectedSapphire} (${selectedCut}). Can we discuss ideas and a quote?`
    );
    window.open(`https://wa.me/94771234567?text=${msg}`, '_blank');
  };

  const handleSelectSapphireAndScroll = (sapphireName: string) => {
    setSelectedSapphire(sapphireName);
    scrollToForm();
  };

  const handleSelectCutAndScroll = (cutName: string) => {
    setSelectedCut(cutName);
    scrollToForm();
  };

  const handleSelectBirthstoneAndScroll = (sapphireName: string) => {
    setSelectedSapphire(sapphireName);
    scrollToForm();
  };

  const handleFormSuccess = (data: any) => {
    setSuccessModalData({
      isOpen: true,
      ticketId: data.ticketId,
      customerName: data.customerName,
      email: data.email,
      jewellerySummary: data.jewellerySummary,
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      {/* 8.1.1 Hero & Expectations */}
      <CustomizeHero
        onStartCustomizing={scrollToForm}
        onOpenWhatsApp={openDirectWhatsApp}
      />

      {/* 8.1.2 Sapphire Varieties Gallery */}
      <SapphireGallery
        selectedSapphire={selectedSapphire}
        onSelectSapphire={handleSelectSapphireAndScroll}
      />

      {/* 8.1.3 Sapphire Cuts Gallery */}
      <CutsGallery
        selectedCut={selectedCut}
        onSelectCut={handleSelectCutAndScroll}
      />

      {/* 8.1.4 Birthstone Styling Guide */}
      <BirthstoneGuide
        onSelectBirthstoneSapphire={handleSelectBirthstoneAndScroll}
      />

      {/* 8.1.5 Our Artisanal Process */}
      <ArtisanalProcess />

      {/* 8.1.6 & 8.2 Interactive Customization Request Form */}
      <CustomizationForm
        selectedJewelleryType={selectedJewelleryType}
        setSelectedJewelleryType={setSelectedJewelleryType}
        selectedMetal={selectedMetal}
        setSelectedMetal={setSelectedMetal}
        selectedSapphire={selectedSapphire}
        setSelectedSapphire={setSelectedSapphire}
        selectedCut={selectedCut}
        setSelectedCut={setSelectedCut}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
        onSubmitSuccess={handleFormSuccess}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        jewelleryType={selectedJewelleryType}
      />

      {/* 8.3 Post-Submission Success Confirmation Modal */}
      <SubmissionSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData((prev) => ({ ...prev, isOpen: false }))}
        ticketId={successModalData.ticketId}
        customerName={successModalData.customerName}
        email={successModalData.email}
        jewellerySummary={successModalData.jewellerySummary}
      />

      {/* 8.3 Floating Direct WhatsApp Concierge CTA */}
      <WhatsAppConciergeCTA
        selectedJewelleryType={selectedJewelleryType}
        selectedMetal={selectedMetal}
        selectedSapphire={selectedSapphire}
        selectedCut={selectedCut}
      />

      <Footer />
    </main>
  );
}
