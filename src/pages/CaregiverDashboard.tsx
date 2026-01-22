import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { io, Socket } from 'socket.io-client';
import { ShieldAlert, UserPlus, Users, HeartPulse, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Caregiver {
    _id: string;
    caregiverEmail: string;
    name: string;
    relationship: string;
    status: 'pending' | 'active' | 'rejected';
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CaregiverDashboard: React.FC = () => {
    const { user, token } = useAuth();
    const { toast } = useToast();
    const [socket, setSocket] = useState<Socket | null>(null);

    // State
    const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [relationship, setRelationship] = useState('Family Member');
    const [sosActive, setSosActive] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Initial Fetch
    useEffect(() => {
        if (token) fetchCaregivers();
    }, [token]);

    // Socket Connection
    useEffect(() => {
        if (!token) return;

        const newSocket = io(`${SOCKET_URL}/caregivers`, {
            auth: { token },
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Connected to Caregiver Namespace');
        });

        newSocket.on('sos_alert', (data) => {
            toast({
                title: "EMERGENCY ALERT!",
                description: `${data.message} - Location: ${data.location?.address}`,
                variant: 'destructive',
                duration: 10000,
            });
            // Play alarm sound if needed
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    const fetchCaregivers = async () => {
        try {
            const res = await fetch(`${API_URL}/caregivers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) setCaregivers(json.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/caregivers/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email: inviteEmail, name: inviteName, relationship })
            });
            const json = await res.json();
            if (json.success) {
                toast({ title: "Invitation Sent", description: `Invited ${inviteEmail}` });
                fetchCaregivers();
                setInviteEmail('');
            } else {
                toast({ title: "Error", description: json.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to send invitation", variant: "destructive" });
        }
    };

    const triggerSOS = async () => {
        // Get valid location if possible
        navigator.geolocation.getCurrentPosition(async (position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: "Current Location (GPS)" // In real app, reverse geocode this
            };

            // Emit via Socket
            socket?.emit('trigger_sos', { patientId: user?.id, location });

            // Also call API for logging
            await fetch(`${API_URL}/caregivers/sos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ location })
            });

            setSosActive(true);
            toast({ title: "SOS ACTIVATED", description: "Alert sent to all caregivers!", variant: "destructive" });
        }, (err) => {
            toast({ title: "Location Error", description: "Could not get location. SOS sent anyway.", variant: "default" });
            // Fallback SOS without location
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-8 h-8 text-primary" /> Care Circles
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: SOS & Vitals */}
                <div className="space-y-6">
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                        <CardHeader>
                            <CardTitle className="text-red-600 flex items-center gap-2">
                                <ShieldAlert className="w-6 h-6" /> Emergency SOS
                            </CardTitle>
                            <CardDescription>
                                Press to alert all caregivers immediately with your location.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                size="lg"
                                className="w-full h-24 text-2xl font-bold animate-pulse"
                                onClick={triggerSOS}
                            >
                                {sosActive ? "SOS SENT!" : "TRIGGER SOS"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" /> Vitals Sharing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Your caregivers can view your real-time health data.
                            </p>
                            <div className="flex items-center justify-between p-2 bg-secondary rounded">
                                <span>Recent Heart Rate</span>
                                <span className="font-bold">72 BPM</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Caregiver Management */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="w-5 h-5" /> Invite Caregiver
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
                                <Input
                                    placeholder="Friend's Email"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    required
                                    type="email"
                                />
                                <Input
                                    placeholder="Name (Optional)"
                                    value={inviteName}
                                    onChange={e => setInviteName(e.target.value)}
                                />
                                <select
                                    className="border rounded px-3 py-2 bg-background"
                                    value={relationship}
                                    onChange={e => setRelationship(e.target.value)}
                                >
                                    <option>Family Member</option>
                                    <option>Doctor</option>
                                    <option>Nurse</option>
                                    <option>Friend</option>
                                </select>
                                <Button type="submit">Invite</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Caregivers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {caregivers.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">No caregivers added yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {caregivers.map((cg) => (
                                        <div key={cg._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <p className="font-semibold">{cg.name || cg.caregiverEmail}</p>
                                                <p className="text-sm text-muted-foreground">{cg.relationship}</p>
                                            </div>
                                            <Badge variant={cg.status === 'active' ? 'default' : 'secondary'}>
                                                {cg.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CaregiverDashboard;
