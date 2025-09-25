import {Switch, Route} from "wouter";
import {QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "./components/ui/toaster.jsx";
import {TooltipProvider} from "./components/ui/tooltip.jsx";
import {queryClient} from "./lib/queryClient.js";
import Dashboard from "./pages/dashboard.jsx";
import Inventory from "./pages/inventory.jsx";
import Reports from "./pages/reports.jsx";
import Suppliers from "./pages/suppliers.jsx";
import Movements from "./pages/movements.jsx";
import NotFound from "./pages/not-found.jsx";
import Sidebar from "./components/layout/sidebar.jsx";
import './App.css'

function Router() {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar/>
            <main className="flex-1 overflow-auto">
                <Switch>
                    <Route path="/" component={Dashboard}/>
                    <Route path="/inventory" component={Inventory}/>
                    <Route path="/reports" component={Reports}/>
                    <Route path="/suppliers" component={Suppliers}/>
                    <Route path="/movements" component={Movements}/>
                    <Route component={NotFound}/>
                </Switch>
            </main>
        </div>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster/>
                <Router/>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
