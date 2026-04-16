"use client";

import React, { useState } from "react";
import BrainstormDashboard, { DiagramMeta } from "./BrainstormDashboard";
import BrainstormCanvas from "./BrainstormCanvas";

interface Props { user?: any; }

const BrainstormView: React.FC<Props> = ({ user }) => {
    const [activeDiagram, setActiveDiagram] = useState<DiagramMeta | null>(null);

    return activeDiagram ? (
        <BrainstormCanvas 
            user={user} 
            diagram={activeDiagram} 
            onBack={() => setActiveDiagram(null)} 
        />
    ) : (
        <BrainstormDashboard 
            user={user} 
            onOpenDiagram={(_id, data) => setActiveDiagram(data)} 
        />
    );
};

export default BrainstormView;
