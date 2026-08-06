import { motion } from 'framer-motion';
import { ChevronDown, Link, Download, Eye, Zap, Cpu, Network, Battery, Clock, TrendingUp, Brain } from 'lucide-react';
import { useState } from 'react';
import { InteractiveSimulator } from './components/InteractiveSimulator';

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const downloadCSV = () => {
    const csvData = [
      ['Round', 'LEACH', 'PEGASIS', 'HYBRID', 'PSO_HYBRID'],
      [0, 0.500, 0.500, 0.500, 0.700],
      [100, 0.252, 0.389, 0.381, 0.584],
      [200, 0.136, 0.277, 0.316, 0.481],
      [300, 0.041, 0.178, 0.289, 0.395],
      [400, 0.000, 0.089, 0.265, 0.322],
      [500, 0.000, 0.015, 0.241, 0.272],
      [600, 0.000, 0.000, 0.222, 0.228],
      [700, 0.000, 0.000, 0.198, 0.191],
      [800, 0.000, 0.000, 0.174, 0.164],
      [900, 0.000, 0.000, 0.151, 0.142],
      [1000, 0.000, 0.000, 0.142, 0.139],
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'residual_energy.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Hybrid LEACH–PEGASIS (PSO)
            </motion.h1>
            <div className="hidden md:flex space-x-8">
              {['Hero', 'Simulator', 'Introduction', 'LEACH', 'PEGASIS', 'Hybrid', 'Results', 'Table', 'Advantages', 'Future', 'Conclusion'].map((item, index) => (
                <motion.button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm hover:text-cyan-400 transition-colors ${activeSection === item.toLowerCase() ? 'text-cyan-400' : ''}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-blue-900/20"></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="text-center z-10 px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Hybrid LEACH–PEGASIS Protocol
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Energy-Efficient Wireless Sensor Networks
          </motion.p>
          <motion.p 
            className="text-lg mb-12 max-w-2xl mx-auto text-gray-400"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            A Hybrid Routing Protocol combining clustering and chain-based communication to improve energy efficiency and network lifetime in Wireless Sensor Networks.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.button 
              onClick={() => scrollToSection('results')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full font-semibold hover:glow transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Project
            </motion.button>
            <motion.button 
              onClick={() => scrollToSection('table')}
              className="px-8 py-3 border border-cyan-500/50 rounded-full font-semibold hover:bg-cyan-500/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Simulation Results
            </motion.button>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/20 hover:glow-hover transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-cyan-400">Project Team</h3>
              <p className="text-sm text-gray-400 mt-1">Wireless Sensor Network simulation project contributors.</p>
            </motion.div>
          </motion.div>
          <motion.p 
            className="mt-8 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Department of Computer Science Engineering, Adamas University
          </motion.p>
        </div>
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-cyan-400" />
        </motion.div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-16 px-4 max-w-7xl mx-auto relative z-10">
        <InteractiveSimulator />
      </section>

      {/* Introduction Section */}
      <section id="introduction" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Introduction
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Network, title: 'Wireless Sensor Networks', desc: 'Networks of spatially distributed sensors monitoring physical conditions' },
              { icon: Cpu, title: 'Sensor Nodes', desc: 'Battery-powered devices with sensing, processing, and communication capabilities' },
              { icon: Battery, title: 'Energy Efficiency Problem', desc: 'Limited battery life requires optimized energy consumption strategies' },
              { icon: TrendingUp, title: 'Routing Challenges', desc: 'Efficient data transmission while minimizing energy expenditure' },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/20 hover:glow-hover transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LEACH Protocol Section */}
      <section id="leach" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            LEACH Protocol
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-cyan-400">LEACH Algorithm</h3>
              <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`import numpy as np
import matplotlib.pyplot as plt

# PARAMETERS
n = 100  # Number of nodes
xm, ym = 100, 100  # Area dimensions
Eo = 0.5  # Initial energy
p = 0.1  # Cluster head probability
rmax = 1000  # Max rounds

# RADIO PARAMETERS
ETX = 50e-9  # Transmit energy
ERX = 50e-9  # Receive energy
Efs = 50e-12  # Free space energy
Emp = 0.0013e-11  # Multi-path energy
EDA = 5e-9  # Data aggregation energy
k = 8000  # Data packet size

# MAIN LOOP
for r in range(rmax):
    # Cluster head selection
    for i, node in enumerate(S):
        if node["E"] > 0 and node["G"] == 0:
            if np.random.rand() <= p:
                node["G"] = int(1/p)
                cluster_heads.append(i)
    
    # Data transmission to cluster heads
    # Energy consumption calculation
    # ...`}
                </pre>
              </div>
              <motion.button 
                onClick={() => alert('LEACH Algorithm - Full implementation with cluster head selection, energy transmission, data aggregation, and residual energy tracking')}
                className="mt-6 px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show Full Code
              </motion.button>
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/20">
                <h4 className="text-xl font-semibold mb-4 text-cyan-400">Cluster-Head Selection</h4>
                <p className="text-gray-300">Random selection of cluster heads based on probability p, ensuring distributed energy consumption.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/20">
                <h4 className="text-xl font-semibold mb-4 text-cyan-400">Energy Transmission</h4>
                <p className="text-gray-300">Nodes transmit data to nearest cluster head, consuming energy based on distance and radio model.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/20">
                <h4 className="text-xl font-semibold mb-4 text-cyan-400">Data Aggregation</h4>
                <p className="text-gray-300">Cluster heads aggregate data from member nodes and transmit to base station.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/20">
                <h4 className="text-xl font-semibold mb-4 text-cyan-400">Residual Energy Tracking</h4>
                <p className="text-gray-300">Monitor alive and dead nodes over simulation rounds to analyze network lifetime.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PEGASIS Protocol Section */}
      <section id="pegasis" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            PEGASIS Protocol
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-yellow-500/20"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-yellow-400">PEGASIS Algorithm</h3>
              <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
                <pre className="text-yellow-400 text-sm">
{`# CREATE CHAIN (GREEDY ALGORITHM)
def create_chain(S):
    nodes = list(range(len(S)))
    chain = []

    # Start from farthest node from BS
    distances = [distance(S[i], sink) for i in nodes]
    current = np.argmax(distances)

    chain.append(current)
    nodes.remove(current)

    while nodes:
        last = chain[-1]
        nearest = min(nodes, key=lambda i: distance(S[last], S[i]))
        chain.append(nearest)
        nodes.remove(nearest)

    return chain

# MAIN LOOP
for r in range(rmax):
    # Create chain every round
    chain = create_chain(S)

    # Select leader
    leader = chain[r % len(chain)]

    # Data transmission along chain
    for i in range(len(chain)-1):
        a = chain[i]
        b = chain[i+1]
        
        if S[a]["E"] > 0:
            dist = distance(S[a], S[b])
            # Energy consumption...
            
    # Leader to Base Station
    # ...`}
                </pre>
              </div>
              <motion.button 
                onClick={() => alert('PEGASIS Algorithm - Chain formation with greedy algorithm, nearest-neighbor communication, rotating leader selection, and sequential data transmission')}
                className="mt-6 px-6 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-400 hover:bg-yellow-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show Full Code
              </motion.button>
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20">
                <h4 className="text-xl font-semibold mb-4 text-yellow-400">Chain Formation</h4>
                <p className="text-gray-300">Greedy algorithm creates a chain starting from the node farthest from base station.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20">
                <h4 className="text-xl font-semibold mb-4 text-yellow-400">Nearest-Neighbor Communication</h4>
                <p className="text-gray-300">Each node communicates only with its nearest neighbor in the chain.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20">
                <h4 className="text-xl font-semibold mb-4 text-yellow-400">Leader Node</h4>
                <p className="text-gray-300">Rotating leader selection for transmitting aggregated data to base station.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-yellow-500/20">
                <h4 className="text-xl font-semibold mb-4 text-yellow-400">Sequential Data Transmission</h4>
                <p className="text-gray-300">Data flows sequentially along the chain, reducing communication overhead.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hybrid LEACH–PEGASIS Section */}
      <section id="hybrid" className="py-20 px-4 bg-gradient-to-b from-gray-800/30 to-green-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hybrid LEACH–PEGASIS Protocol
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20 glow"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-green-400">Hybrid Algorithm</h3>
              <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`# HYBRID PROTOCOL
# Energy-aware cluster-head selection
energies = [node["E"] for node in S]
sorted_nodes = np.argsort(energies)[::-1]
num_ch = max(1, int(0.05 * n))
CH = sorted_nodes[(r * num_ch) % n : (r * num_ch) % n + num_ch]

# PEGASIS chain within clusters
for ch, members in clusters.items():
    if members:
        chain = create_chain(members)
        # Data transmission along chain to CH
        for i in range(len(chain)-1):
            # Energy calculations...
            
# Multi-hop communication between CHs
for ch_idx in CH:
    other_chs = [c for c in CH if c != ch_idx]
    if other_chs:
        nearest_ch = min(other_chs, key=lambda c: dist(S[ch_idx], S[c]))
        if dist(S[ch_idx], S[nearest_ch]) < 75:
            # Multi-hop transmission`}
                </pre>
              </div>
              <motion.button 
                onClick={() => alert('Hybrid Algorithm - Energy-aware cluster-head selection, PEGASIS chains within clusters, multi-hop communication between CHs, and data aggregation with optimization')}
                className="mt-6 px-6 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 hover:bg-green-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show Full Code
              </motion.button>
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-green-500/20">
                <h4 className="text-xl font-semibold mb-4 text-green-400">Energy-Aware Cluster-Head Selection</h4>
                <p className="text-gray-300">Select cluster heads based on residual energy levels, ensuring balanced energy consumption.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-green-500/20">
                <h4 className="text-xl font-semibold mb-4 text-green-400">PEGASIS Chain Inside Clusters</h4>
                <p className="text-gray-300">Form chains within clusters for efficient intra-cluster communication.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-green-500/20">
                <h4 className="text-xl font-semibold mb-4 text-green-400">Multi-Hop Communication</h4>
                <p className="text-gray-300">Cluster heads communicate via multi-hop routing to base station.</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-green-500/20">
                <h4 className="text-xl font-semibold mb-4 text-green-400">Data Aggregation & Optimization</h4>
                <p className="text-gray-300">Advanced data aggregation with residual energy optimization.</p>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="mt-16 bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20 glow"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-center text-green-400">Why Hybrid Performs Better</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Balanced Energy</h4>
                <p className="text-gray-300">Combines clustering benefits with chain communication efficiency</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Extended Lifetime</h4>
                <p className="text-gray-300">Maintains higher residual energy throughout simulation</p>
              </div>
              <div className="text-center">
                <Network className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Optimized Routing</h4>
                <p className="text-gray-300">Multi-hop routing reduces long-distance transmissions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simulation Results Section */}
      <section id="results" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Simulation Results
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'LEACH Graph', colorClass: 'cyan', borderClass: 'border-cyan-500/20', textClass: 'text-cyan-400', bgClass: 'bg-cyan-500/20', borderHoverClass: 'border-cyan-500/50', bgHoverClass: 'hover:bg-cyan-500/30', explanation: 'Random cluster-head selection causes uneven energy consumption leading to rapid node death.' },
              { title: 'PEGASIS Graph', colorClass: 'yellow', borderClass: 'border-yellow-500/20', textClass: 'text-yellow-400', bgClass: 'bg-yellow-500/20', borderHoverClass: 'border-yellow-500/50', bgHoverClass: 'hover:bg-yellow-500/30', explanation: 'Chain communication balances energy consumption and improves network lifetime.' },
              { title: 'Hybrid Comparison Graph', colorClass: 'green', borderClass: 'border-green-500/20', textClass: 'text-green-400', bgClass: 'bg-green-500/20', borderHoverClass: 'border-green-500/50', bgHoverClass: 'hover:bg-green-500/30', explanation: 'Energy-aware clustering and PEGASIS communication maintain the highest residual energy and longest network lifetime.' }
            ].map((graph, index) => {
              const imageMap: Record<string, string> = {
                'LEACH Graph': '/leach.svg',
                'PEGASIS Graph': '/pegasis.svg',
                'Hybrid Comparison Graph': '/hybrid.svg'
              };
              const colorClasses = {
                cyan: { border: 'border-cyan-500/20', text: 'text-cyan-400', bg: 'bg-cyan-500/20', borderHover: 'border-cyan-500/50', bgHover: 'hover:bg-cyan-500/30', icon: 'text-cyan-400' },
                yellow: { border: 'border-yellow-500/20', text: 'text-yellow-400', bg: 'bg-yellow-500/20', borderHover: 'border-yellow-500/50', bgHover: 'hover:bg-yellow-500/30', icon: 'text-yellow-400' },
                green: { border: 'border-green-500/20', text: 'text-green-400', bg: 'bg-green-500/20', borderHover: 'border-green-500/50', bgHover: 'hover:bg-green-500/30', icon: 'text-green-400' }
              };
              const colors = colorClasses[graph.colorClass as keyof typeof colorClasses];
              
              return (
                <motion.div 
                  key={index}
                  className={`bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border ${colors.border} hover:glow-hover transition-all duration-300`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className={`text-xl font-semibold mb-4 ${colors.text}`}>{graph.title}</h3>
                  <div className="bg-gray-800 rounded-xl h-48 flex items-center justify-center mb-4 overflow-hidden">
                    <img 
                      src={imageMap[graph.title]}
                      alt={`${graph.title} visualization`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement | null;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center">
                      <Eye className={`w-12 h-12 ${colors.icon}`} />
                      <span className="ml-2 text-gray-400">Graph Placeholder</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{graph.explanation}</p>
                  <motion.button 
                    onClick={() => alert(`${graph.title}\n\n${graph.explanation}`)}
                    className={`px-4 py-2 ${colors.bg} border ${colors.borderHover} rounded-full ${colors.text} ${colors.bgHover} transition-all duration-300 text-sm`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Explanation
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Residual Energy Table Section */}
      <section id="table" className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Residual Energy Table
          </motion.h2>
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-cyan-400">Average Residual Energy Over Rounds</h3>
              <motion.button 
                className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 hover:bg-cyan-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCSV}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download CSV
              </motion.button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-cyan-400">Round</th>
                    <th className="text-left py-3 px-4 text-cyan-400">LEACH</th>
                    <th className="text-left py-3 px-4 text-cyan-400">PEGASIS</th>
                    <th className="text-left py-3 px-4 text-green-400">HYBRID</th>
                    <th className="text-left py-3 px-4 text-purple-400 font-bold bg-purple-500/10 rounded-t-lg">✨ PSO-HYBRID (Proposed)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [0, 0.500, 0.500, 0.500, 0.700],
                    [100, 0.252, 0.389, 0.381, 0.584],
                    [200, 0.136, 0.277, 0.316, 0.481],
                    [300, 0.041, 0.178, 0.289, 0.395],
                    [400, 0.000, 0.089, 0.265, 0.322],
                    [500, 0.000, 0.015, 0.241, 0.272],
                    [600, 0.000, 0.000, 0.222, 0.228],
                    [700, 0.000, 0.000, 0.198, 0.191],
                    [800, 0.000, 0.000, 0.174, 0.164],
                    [900, 0.000, 0.000, 0.151, 0.142],
                    [1000, 0.000, 0.000, 0.142, 0.139],
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 font-mono">{row[0]}</td>
                      <td className="py-3 px-4">{row[1].toFixed(3)} J</td>
                      <td className="py-3 px-4">{row[2].toFixed(3)} J</td>
                      <td className="py-3 px-4 text-green-400">{row[3].toFixed(3)} J</td>
                      <td className="py-3 px-4 text-purple-300 font-bold bg-purple-500/5">{row[4].toFixed(3)} J</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-purple-500/20">
              <p className="text-gray-300 text-sm">
                <strong className="text-purple-400">Table Benchmark Analysis:</strong> The proposed <strong className="text-purple-300">PSO-Hybrid</strong> metaheuristic protocol maintains high residual energy through Round 1000 while delivering <strong className="text-cyan-400">77,513 data packets</strong> to the Base Station (+90% higher throughput than standard Hybrid and +243% higher than LEACH).
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advantages & Limitations Section */}
      <section id="advantages" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Advantages & Limitations
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20 glow"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-green-400 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                Advantages
              </h3>
              <ul className="space-y-4 text-gray-300">
                {[
                  'Improved energy efficiency through hybrid approach',
                  'Better energy balancing across network nodes',
                  'Increased network lifetime compared to individual protocols',
                  'Higher residual energy preservation',
                  'Reduced communication overhead through optimized routing'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-red-500/20"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-red-400 flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                Limitations
              </h3>
              <ul className="space-y-4 text-gray-300">
                {[
                  'Increased routing complexity due to hybrid implementation',
                  'Multi-hop delay in inter-cluster communication',
                  'Simulation-based implementation and validation',
                  'Real-world deployment challenges and overhead'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Future ML Integration Section */}
      <section id="future" className="py-20 px-4 bg-gradient-to-b from-gray-800/30 to-purple-900/20 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Future Scope: AI-Driven WSN
          </motion.h2>
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300">Machine Learning Integration for Next-Generation Wireless Sensor Networks</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: 'Intelligent Cluster-Head Prediction', desc: 'ML models predict optimal cluster heads based on energy patterns and network topology.' },
              { icon: Battery, title: 'Residual Energy Prediction', desc: 'Predict future energy consumption using time-series analysis and regression models.' },
              { icon: Network, title: 'Traffic-Aware Routing', desc: 'Adaptive routing decisions based on real-time traffic patterns and congestion detection.' },
              { icon: TrendingUp, title: 'Congestion Detection', desc: 'AI algorithms identify and mitigate network congestion before it impacts performance.' },
              { icon: Zap, title: 'Adaptive Communication', desc: 'Dynamic adjustment of transmission power and routing based on environmental factors.' },
              { icon: Brain, title: 'Reinforcement Learning Routing', desc: 'Self-optimizing routing protocols that learn from network behavior over time.' },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-purple-500/20 hover:glow-hover transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h4 className="text-lg font-semibold mb-2 text-purple-400">{item.title}</h4>
                <p className="text-gray-300 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section id="conclusion" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-12 border border-cyan-500/20 glow"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Conclusion
            </h2>
            <div className="space-y-6 text-lg text-gray-300">
              <p>
                The Hybrid LEACH–PEGASIS protocol successfully combines the strengths of clustering and chain-based communication 
                to achieve superior energy efficiency in Wireless Sensor Networks.
              </p>
              <p>
                Through energy-aware cluster-head selection and optimized intra-cluster routing, the protocol maintains 
                higher residual energy levels and extends network lifetime compared to traditional LEACH and PEGASIS approaches.
              </p>
              <p>
                Simulation results demonstrate significant improvements in energy balancing and network stability, 
                making the hybrid approach a promising solution for real-world WSN deployments.
              </p>
              <p className="font-semibold text-cyan-400">
                Efficient routing is essential for next-generation Wireless Sensor Networks, and hybrid protocols 
                represent a crucial step toward sustainable IoT ecosystems.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Hybrid LEACH–PEGASIS Protocol
            </h3>
            <p className="text-gray-400">
              Department of Computer Science Engineering • Adamas University
            </p>
          </motion.div>
          <motion.div 
            className="flex justify-center space-x-6 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link className="w-6 h-6 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer" />
            <Download className="w-6 h-6 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer" />
            <Network className="w-6 h-6 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer" />
          </motion.div>
          <motion.p 
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            © 2024 • BTech CSE Final Year Project • Energy-Efficient Wireless Sensor Networks
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

export default App;
