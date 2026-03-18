# White Caves CRM - Kubernetes Deployment Configuration
# Production-ready K8s manifests for the White Caves platform

---

## Kubernetes Architecture

```
┌─────────────────────────────────────────────────────┐
│               Kubernetes Cluster                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Ingress (SSL/TLS Termination)                │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                 │
│  ┌────────────────▼─────────────────────────────┐  │
│  │ Service (LoadBalancer/ClusterIP)            │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                                 │
│  ┌────────────────▼─────────────────────────────┐  │
│  │ Deployment (App Pods - HPA scales)          │  │
│  │  ├─ Pod 1 (App Container)                   │  │
│  │  ├─ Pod 2 (App Container)                   │  │
│  │  └─ Pod N (App Container)                   │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────༻───┬────────────┬──────────────┐  │
│  ▼                  ▼            ▼              ▼  │
│┌─────────┐    ┌──────────┐   ┌────────┐   ┌──────┐│
││MongoDB  │    │  Redis   │   │Secrets │   │ConfigM││
│└─────────┘    └──────────┘   └────────┘   └──────┘│
│   StatefulSet    StatefulSet   Resources   Maps   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Key Features

✅ **High Availability**: Multiple replicas with pod disruption budgets
✅ **Auto-Scaling**: HPA scales pods based on CPU/memory metrics
✅ **Resource Management**: Requests and limits defined
✅ **Health Checks**: Liveness and readiness probes
✅ **Persistent Storage**: Volumes for MongoDB and Redis
✅ **Service Mesh Ready**: Compatible with Istio/Linkerd
✅ **GitOps Ready**: Designed for FluxCD/ArgoCD
✅ **Multi-environment**: Dev, staging, production configurations

---

## Prerequisites

```bash
# Kubernetes cluster (1.20+)
kubectl version

# Load balancer or Ingress controller
kubectl get svc -n ingress-nginx

# Metrics server (for HPA)
kubectl get deployment metrics-server -n kube-system

# Storage provisioner (for persistent volumes)
kubectl get storageclass
```

---

## Installation Steps

### 1. Create Namespace

```bash
kubectl create namespace white-caves
kubectl config set-context --current --namespace=white-caves
```

### 2. Create Secrets and ConfigMaps

```bash
# Create secrets from environment variables
kubectl create secret generic white-caves-secrets \
  --from-literal=jwt-secret=<your-jwt-secret> \
  --from-literal=database-url=<your-mongodb-url> \
  --from-literal=redis-url=<your-redis-url> \
  -n white-caves

# Create config maps
kubectl create configmap white-caves-config \
  --from-literal=node-env=production \
  --from-literal=cors-origin=https://white-caves.com \
  -n white-caves
```

### 3. Deploy MongoDB (StatefulSet)

```bash
kubectl apply -f k8s/mongodb-statefulset.yaml
kubectl wait --for=condition=Ready pod -l app=mongodb -n white-caves --timeout=300s
```

### 4. Deploy Redis (StatefulSet)

```bash
kubectl apply -f k8s/redis-statefulset.yaml
kubectl wait --for=condition=Ready pod -l app=redis -n white-caves --timeout=300s
```

### 5. Deploy Application (Deployment + HPA)

```bash
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-hpa.yaml
kubectl wait --for=condition=Available deployment/white-caves-app -n white-caves --timeout=300s
```

### 6. Create Service

```bash
kubectl apply -f k8s/app-service.yaml
```

### 7. Create Ingress (Optional)

```bash
kubectl apply -f k8s/ingress.yaml
```

---

## Verification

```bash
# Check deployments
kubectl get deployments -n white-caves
kubectl get statefulsets -n white-caves

# Check pods
kubectl get pods -n white-caves
kubectl logs -f deployment/white-caves-app -n white-caves

# Check services
kubectl get svc -n white-caves
kubectl get ingress -n white-caves

# Check HPA status
kubectl get hpa -n white-caves
kubectl describe hpa white-caves-app -n white-caves

# Port forward to test locally
kubectl port-forward svc/white-caves 5000:5000 -n white-caves
curl http://localhost:5000/health
```

---

## Scaling

### Manual Scaling

```bash
# Scale to 5 replicas
kubectl scale deployment/white-caves-app --replicas=5 -n white-caves

# Check replica set
kubectl get rs -n white-caves
```

### Auto-Scaling (HPA)

```bash
# HPA automatically scales based on metrics
kubectl get hpa -n white-caves

# View HPA events
kubectl describe hpa white-caves-app -n white-caves

# Current metrics
kubectl get hpa white-caves-app -n white-caves -w
```

---

## Upgrades

### Rolling Update

```bash
# Update image
kubectl set image deployment/white-caves-app \
  white-caves=white-caves:v1.1.0 \
  -n white-caves

# Watch rollout
kubectl rollout status deployment/white-caves-app -n white-caves

# Rollback if needed
kubectl rollout undo deployment/white-caves-app -n white-caves
```

---

## Monitoring & Logging

```bash
# Pod metrics
kubectl top pods -n white-caves
kubectl top nodes

# Resource usage
kubectl describe node

# Logs
kubectl logs -f pod/white-caves-app-xyz -n white-caves
kubectl logs --all-containers=true -f deployment/white-caves-app -n white-caves

# Events
kubectl get events -n white-caves --sort-by='.lastTimestamp'
```

---

## Cleanup

```bash
# Delete entire namespace (WARNING: deletes all resources)
kubectl delete namespace white-caves

# Or delete individual resources
kubectl delete deployment white-caves-app -n white-caves
kubectl delete statefulset mongodb -n white-caves
kubectl delete statefulset redis -n white-caves
```

---

## Production Checklist

- [ ] Cluster provisioned (AWS EKS, GCP GKE, Azure AKS)
- [ ] Storage class configured
- [ ] Metrics server installed
- [ ] Ingress controller deployed
- [ ] Secrets securely managed (HashiCorp Vault, AWS Secrets Manager)
- [ ] Monitoring and logging configured (Prometheus, ELK, DataDog)
- [ ] Backup strategy implemented
- [ ] RBAC policies defined
- [ ] Network policies configured
- [ ] Pod security policies enforced
- [ ] Resource quotas set
- [ ] Horizontal Pod Autoscaler tested
- [ ] Disaster recovery plan documented
- [ ] Team trained on operations

---

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Package Manager](https://helm.sh/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
- [Production Readiness Checklist](https://kubernetes.io/docs/concepts/configuration/overview/)
